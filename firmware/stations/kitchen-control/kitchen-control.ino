#include <LiquidCrystal.h>
LiquidCrystal lcd (12, 11, 5, 4, 3, 2);

const int buttonPin = 6;
const int sensorPin = A0;
const int alarmPin = 7;
const int led1 = 10;
const int led2 = 9;
const int led3 = 8;

// Used for initial thermocouple reading.
int sensorValue = 0;
float thermoCoupleValue = 0;
float oneWireValue = 0;

bool alarmState = 0;
bool buttonState = 0;
int programState = 0;

unsigned long lastMillis = millis();
unsigned long currentMillis = millis();
unsigned long thermoCoupleTimer = 0;
unsigned long oneWireTimer = 0;
int thermoCoupleRate = 10 * 1000;
int oneWireRate = 10 * 1000;

String str = "";

void setup() {
  lcd.begin(16, 2);
  pinMode(buttonPin, INPUT);
  pinMode(led1, OUTPUT);
  digitalWrite(led1, HIGH);
  pinMode(led2, OUTPUT);
  digitalWrite(led2, LOW);
  pinMode(led3, OUTPUT);
  digitalWrite(led3, LOW);
  Serial.begin(9600);
}


void loop() {
  checkButton();
  currentMillis = millis();
  thermoCoupleTimer += currentMillis - lastMillis;
  oneWireTimer += currentMillis - lastMillis;
  
  lastMillis = currentMillis;
  if (thermoCoupleTimer > thermoCoupleRate) {
    readThermoCouple();
    updateLCD();
    thermoCoupleTimer = 0;
  }
  if (oneWireTimer > oneWireRate) {
    readOneWire();
    updateLCD();
    oneWireTimer = 0;
  }
}

void checkButton() {
  buttonState = digitalRead(buttonPin);
  if (buttonState == 1) {
    programState += 1;
    if (programState == 3) {
      programState = 0;
    }
    switch(programState) {
      case 0:
        digitalWrite(led3, LOW);
        digitalWrite(led1, HIGH);
        thermoCoupleRate = 60 * 1000;
        oneWireRate = 60 * 1000;
        break;
       case 1:
        digitalWrite(led1, LOW);
        digitalWrite(led2, HIGH);
        thermoCoupleRate = 60 * 1000;
        oneWireRate = 5 * 1000;
        break;
       case 2:
        digitalWrite(led2, LOW);
        digitalWrite(led3, HIGH);
        thermoCoupleRate = 10 * 1000;
        oneWireRate = 60 * 1000;
        break;
    }
    delay(500);
  }
}

void readThermoCouple() {
  alarmState = digitalRead(alarmPin);
  if (alarmState) {
    thermoCoupleValue = 0;
  } else {
    sensorValue = analogRead(sensorPin);
    thermoCoupleValue = adc_to_farhenheight(sensorValue);
  }
  Serial.print("{\"sensor\": {\"name\": \"kitchen-oven\", \"value\": ");
  Serial.print((int)thermoCoupleValue*100);
  Serial.println("}}");
}

void readOneWire() {
  oneWireValue = 60;
//  Serial.print("{\"sensor\": {\"name\": \"kitchen-temperature\", \"value\": ");
//  Serial.print((int)oneWireValue*100);
//  Serial.println("}}");
}
int i = 0;

void updateLCD() {
  if (alarmState) {
    lcd.setCursor(0, 0);
    lcd.print("    Warning!    ");
    lcd.print("Sensor Unplugged"); 
  } else {
    lcd.setCursor(0, 0);
    lcd.print("Oven: ");
    lcd.print(thermoCoupleValue);
    lcd.print(" F");
    lcd.setCursor(0, 1);
    lcd.print("Wire: ");
    lcd.print("Disconnected");
    lcd.print("");
    lcd.print(i);
    i += 1;
  }
}

float adc_to_farhenheight(int x){
    return (((float) x / 2.046 * 9.0 / 5.0) + 32.0);
}

