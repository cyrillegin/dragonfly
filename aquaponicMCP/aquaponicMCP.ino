void setup() {
  //setup analog connections
  //setup serial
}

void loop() {
  LogData();
  SendData();
  GetInput();
  SendCommands();

}

void LogData(){
  //log water temp
  //log water ph
  //log water turbidity
  //log plant light
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

