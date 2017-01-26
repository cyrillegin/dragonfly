//L = left sensor, R = right sensor
const int lightSensorR = A0;
const int lightSensorL = A1;
const int waterTempSensor = A2;
const int waterTurbSensor = A3;
const int waterPHSensor = A4;

float lightR = 0.0;
float lightL = 0.0;
float waterTemp = 0.0;
float waterTurb = 0.0;
float waterPH = 0.0;

uint16_t lightRBuffer[64];
uint16_t lightLBuffer[64];
uint16_t tempBuffer[64];
uint16_t turbBuffer[64];
uint16_t pHBuffer[64];

uint8_t bufferCounter = 1;


void setup() {
  Serial.begin(9600);
  lightRBuffer[0] = 1791;
  lightLBuffer[0] = 1792;
  tempBuffer[0] = 1793;
  turbBuffer[0] = 1794;
  pHBuffer[0] = 1795;
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
  if(bufferCounter >= 64) return;
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

//im sure there is a better way, consider a timeout? 
//we'll need to check for missed or overwritten data 
//because this might take to long
void SendData(){
  if(bufferCounter >= 64){
    SendBuffer(lightRBuffer);
    SendBuffer(lightLBuffer);
    SendBuffer(tempBuffer);
    SendBuffer(turbBuffer);
    SendBuffer(pHBuffer);
    bufferCounter = 1;
  }
}

void SendBuffer(int buf[]){
  for(int i = 0; i < 64; i++){
    Serial.write(buf[i]);
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

