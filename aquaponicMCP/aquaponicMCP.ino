
#include <OneWire.h>
//L = left sensor, R = right sensor
#define lightSensorR A0
#define lightSensorL A1
OneWire  ds(2); //water temp sensor on digital pin 2
#define waterTurbSensor A3

#define minLightL 0
#define minLightR 0
#define targetTemperature 0
#define temperatureVarience 0
#define targetTurbidity 0
#define turbidityVarience 0

#define lLightLed 13
#define rLightLed 12
#define turbLed 11
#define tempLed 10

float lightR = 0.0;
float lightL = 0.0;
float waterTemp = 0.0;
float waterTurb = 0.0;

uint16_t lightRBuffer[64];
uint16_t lightLBuffer[64];
uint16_t tempBuffer[64];
uint16_t turbBuffer[64];

uint8_t bufferCounter = 1;

bool leftLightOn = false;
bool rightLightOn = false;
bool aquariumLightOn = false;

void setup() {
  Serial.begin(9600);
  lightRBuffer[0] = 1791;
  lightLBuffer[0] = 1792;
  tempBuffer[0] = 1793;
  turbBuffer[0] = 1794;
  pinMode(lLightLed, OUTPUT);
  pinMode(rLightLed, OUTPUT);
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
  lightR = analogRead(lightSensorR);
  lightL = analogRead(lightSensorL);
  waterTemp = analogRead(waterTempSensor);
  waterTurb = analogRead(waterTurbSensor);
  lightRBuffer[bufferCounter] = lightR;
  lightLBuffer[bufferCounter] = lightL;
  tempBuffer[bufferCounter] = waterTemp;
  turbBuffer[bufferCounter] = waterTurb;
  bufferCounter += 1;
  Serial.print("leftLight: ");
  Serial.print(lightL);
  Serial.print(" rightLight: ");
  Serial.print(lightR);
  Serial.print(" waterTemp: ");
  Serial.println(waterTemp);
  Serial.print(" waterTurb: ");
  Serial.print(waterTurb);
}

//im sure there is a better way, consider a timeout? 
//we'll need to check for missed or overwritten data 
//because this might take to long
void SendData(){
  if(bufferCounter >= 64){
    SendBuffer(lightRBuffer);
    SendBuffer(lightLBuffer);
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
  if(leftLightOn && lightL < minLightL){
    digitalWrite(lLightLed, HIGH);
  }
  if(rightLightOn && lightR < minLightR){
    digitalWrite(rLightLed, HIGH);
  }
  
  //water temperature
  float tempDifference = targetTemperature > waterTemp ? targetTemperature - waterTemp : waterTemp - targetTemperature;
  if(tempDifference > temperatureVarience){
    digitalWrite(tempLed, HIGH);
  }

  //water turbidity
  float turbDifference = targetTurbidity > waterTurb ? targetTurbidity - waterTurb : waterTurb - targetTurbidity;
  if(turbDifference > turbidityVarience){
    digitalWrite(turbLed, HIGH);
  }

//  aquarium light scheduling
//  water temp modifications
//  plant light scheduling
}

