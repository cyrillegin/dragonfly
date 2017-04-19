                       

#define RELAY1  7  
int led = 13;                      
void setup(){    
  Serial.begin(9600);
  pinMode(RELAY1, OUTPUT); 
  pinMode(led, OUTPUT);       
}

void loop(){

   digitalWrite(RELAY1,0);           // Turns ON Relays 1
   digitalWrite(led, HIGH);
   Serial.println("Light ON");
   delay(2000);                                      // Wait 2 seconds

   digitalWrite(RELAY1,1);          // Turns Relay Off
   digitalWrite(led, LOW);
   Serial.println("Light OFF");
   delay(2000);  
}
