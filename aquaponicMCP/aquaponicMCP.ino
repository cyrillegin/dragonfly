
#include "OneWire.h"

//analog pins
#define plantLight A0
#define aquaLight A1
#define waterTurbSensor A2

//digital pins
OneWire  ds(2); //water temp sensor
#define RELAY1  3
#define plantLed 4
#define aquaLed 5
#define turbLed 6
#define tempLed 7
#define lightButton 8

//sensor constraints
#define minLightPlant 0
#define minLightAqua 0
#define targetTemperature 0
#define temperatureVarience 0
#define targetTurbidity 0
#define turbidityVarience 0

//sensor readings
float aquaLightReading = 0.0;
float plantLightReading = 0.0;
float waterTempReading = 0.0;
float waterTurbReading = 0.0;

//buffers to hold sensor data
uint16_t plantLightBuffer[64];
uint16_t aquaLightBuffer[64];
uint16_t tempBuffer[64];
uint16_t turbBuffer[64];

uint8_t bufferCounter = 1;

bool powerIsOn = false;

uint8_t incomingByte;

bool onAuto = true;
#define autoTime 1 //number of hours until auto mode resumes.
unsigned long autoTimer = 0;

//run once on start
void setup() {
  Serial.begin(9600);
  plantLightBuffer[0] = 1791;
  aquaLightBuffer[0] = 1792;
  tempBuffer[0] = 1793;
  turbBuffer[0] = 1794;
  pinMode(plantLed, OUTPUT);
  pinMode(aquaLed, OUTPUT);
  pinMode(turbLed, OUTPUT);
  pinMode(tempLed, OUTPUT);
  pinMode(lightButton, INPUT);
  digitalWrite(lightButton, HIGH);
}

//main program loop.
void loop() {
  LogData();
  SendData();
  SendCommands();
  GetManual();
  if(onAuto){
    GetInput();
  } else {
    if(millis() > autoTimer + autoTime*3600*1000){
      onAuto = false;
    }
  }
}

/* Any kind of manual control will go here. Currently a button 
 * is hooked up and will turn the lights either on or off. 
 * After an hour has passed, auto mode will turn back on.
 */
void GetManual(){
  if(digitalRead(lightButton)){
    digitalWrite(RELAY1, powerIsOn);
    powerIsOn = !powerIsOn;
    autoTimer = millis();
  }
}

/*these will be raw readings, converting from voltage to 
 * degrees or light etc should most likly done in a seperate 
 * function or even in the data logger.
 */
void LogData(){
  if(bufferCounter >= 64) return;
  plantLightReading = analogRead(aquaLight);
  aquaLightReading = analogRead(plantLight);
  waterTempReading = ReadTemp();
  waterTurbReading = analogRead(waterTurbSensor);
  plantLightBuffer[bufferCounter] = plantLightReading;
  aquaLightBuffer[bufferCounter] = aquaLightReading;
  tempBuffer[bufferCounter] = waterTempReading;
  turbBuffer[bufferCounter] = waterTurbReading;
  bufferCounter += 1;
  Serial.print("aquaLight: ");
  Serial.print(aquaLightReading);
  Serial.print(" rightLight: ");
  Serial.print(plantLightReading);
  Serial.print(" waterTemp: ");
  Serial.println(waterTempReading);
  Serial.print(" waterTurb: ");
  Serial.print(waterTurbReading);
}

//Script I found online and modifed using the OneWire, returns the temperature in fahrenheit.
float ReadTemp(){
  byte i;
  byte present = 0;
  byte type_s;
  byte data[12];
  byte addr[8];
  float celsius, fahrenheit;

  if ( !ds.search(addr)) {
//    Serial.println("No more addresses.");
    ds.reset_search();
    delay(250);
    return;
  }

  if (OneWire::crc8(addr, 7) != addr[7]) {
//      Serial.println("CRC is not valid!");
      return;
  }

  // the first ROM byte indicates which chip
  switch (addr[0]) {
    case 0x10:
//      Serial.println("  Chip = DS18S20");  // or old DS1820
      type_s = 1;
      break;
    case 0x28:
//      Serial.println("  Chip = DS18B20");
      type_s = 0;
      break;
    case 0x22:
//      Serial.println("  Chip = DS1822");
      type_s = 0;
      break;
    default:
//      Serial.println("Device is not a DS18x20 family device.");
      return;
  } 

  ds.reset();
  ds.select(addr);
  ds.write(0x44);        // start conversion, use ds.write(0x44,1) with parasite power on at the end

  delay(1000);     // maybe 750ms is enough, maybe not
  // we might do a ds.depower() here, but the reset will take care of it.

  present = ds.reset();
  ds.select(addr);    
  ds.write(0xBE);         // Read Scratchpad

  for ( i = 0; i < 9; i++) {           // we need 9 bytes
    data[i] = ds.read();
  }

  int16_t raw = (data[1] << 8) | data[0];
  if (type_s) {
    raw = raw << 3; // 9 bit resolution default
    if (data[7] == 0x10) {
      // "count remain" gives full 12 bit resolution
      raw = (raw & 0xFFF0) + 12 - data[6];
    }
  } else {
    byte cfg = (data[4] & 0x60);
    if (cfg == 0x00) raw = raw & ~7;  // 9 bit resolution, 93.75 ms
    else if (cfg == 0x20) raw = raw & ~3; // 10 bit res, 187.5 ms
    else if (cfg == 0x40) raw = raw & ~1; // 11 bit res, 375 ms
  }
  celsius = (float)raw / 16.0;
  fahrenheit = celsius * 1.8 + 32.0;
  return fahrenheit;
}

/* Im sure there is a better way, consider a timeout? 
 * we'll need to check for missed or overwritten data 
 * because this might take to long
 */
void SendData(){
  if(bufferCounter >= 64){
    SendBuffer(plantLightBuffer);
    SendBuffer(aquaLightBuffer);
    SendBuffer(tempBuffer);
    SendBuffer(turbBuffer);
    bufferCounter = 1;
  }
}

void SendBuffer(int buf[]){
  for(int i = 0; i < 64; i++){
    Serial.write(buf[i]);
  }
}

//read input via serial
void GetInput(){
  if (Serial.available() > 0) {
    incomingByte = Serial.read();
 
    //light schduling 
    //turn lights off
    if(incomingByte == 1){
       digitalWrite(RELAY1,0);
       powerIsOn = false;
    }
    //turn lights on
    if(incomingByte == 2){
       digitalWrite(RELAY1,1);
       powerIsOn = true;
    }
  }
}

//turns on warning leds, should later control temperature.
void SendCommands(){
//  sensor operation
//  lighting
  if(powerIsOn && aquaLightReading < minLightAqua){
    digitalWrite(aquaLed, HIGH);
  }
  if(powerIsOn && plantLightReading < minLightPlant){
    digitalWrite(plantLed, HIGH);
  }
  
  //water temperature
  float tempDifference = targetTemperature > waterTempReading ? targetTemperature - waterTempReading : waterTempReading - targetTemperature;
  if(tempDifference > temperatureVarience){
    digitalWrite(tempLed, HIGH);
  }

  //water turbidity
  float turbDifference = targetTurbidity > waterTurbReading ? targetTurbidity - waterTurbReading : waterTurbReading - targetTurbidity;
  if(turbDifference > turbidityVarience){
    digitalWrite(turbLed, HIGH);
  }

//  water temp modifications
}

