
#include "OneWire.h"

//analog pins
#define plantLight A0
#define aquaLight A3
#define waterTurbSensor A1
#define ovenTempSensor A4

//digital pins  
OneWire  ds(2); //water temp sensor
#define RELAY1 3

bool powerIsOn = true;

uint8_t incomingByte;

//run once on start
void setup() {
  Serial.begin(9600);
  pinMode(RELAY1, OUTPUT);
  digitalWrite(RELAY1, HIGH);
}

//main program loop.
void loop() {
  SendData();
  GetInput();
}

/*these will be raw readings, converting from voltage to 
 * degrees or light etc should most likly done in a seperate 
 * function or even in the data logger.
 */
void SendData(){
  String mystr = "['data', {'station': 'aquaponicStation', 'sensors': [";
  mystr += "{'sensor': 'aquaLight', 'type': 'lightsensor', 'value': ";
  mystr += analogRead(aquaLight) ;
  mystr += "},{'sensor':'ovenTemp', 'type': 'temperature', 'value':";
  mystr += analogRead(ovenTempSensor);  
  mystr += "},{'sensor':'plantLight', 'type': 'lightsensor', 'value':";
  mystr += analogRead(plantLight);
  mystr += "},{'sensor':'waterTurb', 'type': 'cleanliness', 'value':";
  mystr += analogRead(waterTurbSensor);
  
  mystr += "},{'sensor':'waterTemp', 'type': 'temperature', 'value':";
  mystr += ReadTemp();
  mystr += "},{'sensor':'lightSwitch', 'type': 'lightswitch', 'value':";
  mystr += powerIsOn;
  
  mystr += "}]}]";
  Serial.println(mystr);
}

//read input via serial
void GetInput(){
  if (Serial.available() > 0) {
    incomingByte = Serial.read();
    //light schduling 
    //turn lights off
    Serial.println(incomingByte);
    if(incomingByte == 48){     //being sent 1
       digitalWrite(RELAY1,0);
       powerIsOn = false;
    }
    //turn lights on
    if(incomingByte == 49){     //being sent 0
       digitalWrite(RELAY1,1);
       powerIsOn = true;
    }
  }
}

//Script I found online and modifed using the OneWire library, returns the temperature in fahrenheit.
float ReadTemp(){
  byte i;
  byte present = 0;
  byte type_s;
  byte data[12];
  byte addr[8];
  float celsius, fahrenheit;

  if ( !ds.search(addr)) {
    ds.reset_search();
    delay(250);
    return;
  }

  if (OneWire::crc8(addr, 7) != addr[7]) {
      return;
  }

  // the first ROM byte indicates which chip
  switch (addr[0]) {
    case 0x10:
      type_s = 1;
      break;
    case 0x28:
      type_s = 0;
      break;
    case 0x22:
      type_s = 0;
      break;
    default:
      return;
  } 

  ds.reset();
  ds.select(addr);
  ds.write(0x44);        // start conversion, use ds.write(0x44,1) with parasite power on at the end

  delay(1000);     // maybe 750ms is enough, maybe not
  // we might do a ds.depower() here, but the reset will take care of it.

  present = ds.reset();
  ds.select(addr);    
  ds.write(0xBE);         // Read Scratchpad

  for ( i = 0; i < 9; i++) {           // we need 9 bytes
    data[i] = ds.read();
  }

  int16_t raw = (data[1] << 8) | data[0];
  if (type_s) {
    raw = raw << 3; // 9 bit resolution default
    if (data[7] == 0x10) {
      // "count remain" gives full 12 bit resolution
      raw = (raw & 0xFFF0) + 12 - data[6];
    }
  } else {
    byte cfg = (data[4] & 0x60);
    if (cfg == 0x00) raw = raw & ~7;  // 9 bit resolution, 93.75 ms
    else if (cfg == 0x20) raw = raw & ~3; // 10 bit res, 187.5 ms
    else if (cfg == 0x40) raw = raw & ~1; // 11 bit res, 375 ms
  }
  celsius = (float)raw / 16.0;
  fahrenheit = celsius * 1.8 + 32.0;
  return fahrenheit;
}


