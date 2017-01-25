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


void setup() {
  //setup digital connections
  //setup serial
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
}

void SendData(){
//  send buffered frame every x seconds
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

