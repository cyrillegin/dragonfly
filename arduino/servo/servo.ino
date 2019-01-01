#include <Servo.h> 

Servo servo; 

int servoPin = 3; 
int minAngle = 0;
int maxAngle = 155;

int currentAngle = 90;

void setup() { 
   servo.attach(servoPin); 
   Serial.begin(9600);
}

int incoming = 1;

void loop(){ 
  
  incoming = incoming * (Serial.read() - '0');

//  // Check if number has been recieved.
//  if (incoming.length() == 0) {
//    return;
//  }
//  for(int i = 0; i < incoming.length(); i++) {
//    if (isdigit(incoming[i]) == false) {
//      return;
//    }
//  }
 
  currentAngle = incoming;

  // Make sure that number is within the bounds of the servo
  if (currentAngle < minAngle) {
    currentAngle = minAngle;
  }
  if (currentAngle > maxAngle) {
    currentAngle = maxAngle;
  }
  Serial.println(currentAngle);
//  servo.write(currentAngle);
}
