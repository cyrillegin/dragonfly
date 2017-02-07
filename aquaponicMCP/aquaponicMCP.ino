
#include <OneWire.h>
#define plantLight A0
#define aquaLight A1
OneWire  ds(2); //water temp sensor on digital pin 2
#define waterTurbSensor A3

#define minLightPlant 0
#define minLightAqua 0
#define targetTemperature 0
#define temperatureVarience 0
#define targetTurbidity 0
#define turbidityVarience 0

#define plantLed 13
#define aquaLed 12
#define turbLed 11
#define tempLed 10

float aquaLightReading = 0.0;
float plantLightReading = 0.0;
float waterTempReading = 0.0;
float waterTurbReading = 0.0;

uint16_t plantLightBuffer[64];
uint16_t aquaLightBuffer[64];
uint16_t tempBuffer[64];
uint16_t turbBuffer[64];

uint8_t bufferCounter = 1;

bool plantLightOn = false;
bool aquaLightOn = false;

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
}

void loop() {
  LogData();
//  SendData();
//  GetInput();
//  SendCommands();
}

/*these will be raw readings, converting from voltage to 
 * degrees or light etc should most likly done in a seperate 
 * function or even in the data logger.
 */
void LogData(){
  if(bufferCounter >= 64) return;
  plantLightReading = analogRead(aquaLight);
  aquaLightReading = analogRead(plantLight);
//  waterTempReading = analogRead(waterTempSensor);
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

//im sure there is a better way, consider a timeout? 
//we'll need to check for missed or overwritten data 
//because this might take to long
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

void GetInput(){
  if (Serial.available() > 0) {
//    incomingByte = Serial.read();
//    if(incomingByte == 'a'){
//       
//    }
  }
}

void SendCommands(){
//  sensor operation
//  lighting
  if(aquaLightOn && aquaLightReading < minLightAqua){
    digitalWrite(aquaLed, HIGH);
  }
  if(plantLightOn && plantLightReading < minLightPlant){
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

//  aquarium light scheduling
//  water temp modifications
//  plant light scheduling
}

