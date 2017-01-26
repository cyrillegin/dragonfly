//L = left sensor, R = right sensor
const int lightSensorR = A0;
const int lightSensorL = A1;
const int waterTempSensor = A2;
const int waterTurbSensor = A3;
const int waterPHSensor = A4;

float lightR = 0.0;
float lightL = 0.0;
float waterTemp = 0.0;
float watherTurb = 0.0;
float waterPH = 0.0;

uint16_t lightRBuffer[64];
uint16_t lightLBuffer[64];
uint16_t tempBuffer[64];
uint16_t turbBuffer[64];
uint16_t pHRBuffer[64];

uint8_t bufferCounter = 1;


void setup() {
  Serial.begin(9600);
  lightRBuffer[0] = 1791;
  lightLBuffer[0] = 1792;
  tempBuffer[0] = 1793;
  turbBuffer[0] = 1794;
  pHRBuffer[0] = 1795;
}

void loop() {
  LogData();
  SendData();
  GetInput();
  SendCommands();
}

/*these will be raw readings, converting from voltage to 
 * degrees or light etc should most likly done in a seperate 
 * function or even in the data logger.
 */
void LogData(){
  lightR = analogRead(lightSensorR);
  lightL = analogRead(lightSensorL);
  waterTemp = analogRead(waterTempSensor);
  waterTurb = analogRead(waterTurbSensor);
  waterPH = analogRead(waterPHSensor);
  lightRBuffer[bufferCounter] = lightR;
  lightLBuffer[bufferCounter] = lightL;
  tempBuffer[bufferCounter] = waterTemp;
  turbBuffer[bufferCounter] = waterTurb;
  pHBuffer[bufferCounter] = waterPH;
  bufferCounter += 1;
}

void SendData(){
//  send buffered frame every x seconds
  if(bufferCounter >= 64){
  
  }
}

void GetInput(){
//  Listen to awaiting commands(should be kept in a buffer server side)
//  Preform actions if necessary
}

void SendCommands(){
//  aquarium light scheduling
//  water temp modifications
//  plant light scheduling
//  turn on warnings if needed
}

