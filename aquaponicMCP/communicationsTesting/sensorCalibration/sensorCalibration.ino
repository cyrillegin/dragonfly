
#define tankLight A3
#define plantLight A1
#define tankTemp A2
#define ovenTemp
#define tankTurb A0

float tankL = 0;
float plantL = 0;
float ovenT = 0;
float tankT = 0;
float tankTu = 0;


void setup() {
  Serial.begin(9600);
}

void loop() {
 tankL = analogRead(tankLight);
 plantL = analogRead(tankLight);
 tankT = analogRead(tankLight);
 ovenT = analogRead(tankLight);
 tankTu = analogRead(tankLight);

  Serial.print("tankL: ");
  Serial.print(tankL);
  Serial.print(" plantkL: ");
  Serial.print(plantL);
  Serial.print(" tankT: ");
  Serial.print(tankT);
  Serial.print(" ovenT: ");
  Serial.print(ovenT);
  Serial.print(" tankTu: ");
  Serial.print(tankTu);
  Serial.println(" ");


 
}
