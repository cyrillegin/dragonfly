
int led = 13;
bool isOn = false;
String incomingByte;

void setup() {     
  Serial.begin(9600);           
  pinMode(led, OUTPUT);     
}

void loop() {
  if (Serial.available() > 0) {
      incomingByte = Serial.read();
      if(incomingByte == 'a'){
        ToggleLight();
      }
      Serial.println("received: ");
      Serial.println(incomingByte);
   }
}

void ToggleLight(){
  if(isOn){
    digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000); 
  } else {
    digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);
  }
  isOn = !isOn;
}

