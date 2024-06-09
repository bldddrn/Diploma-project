#include <Arduino.h>
#include <FastLED.h>

#define NUM_LEDS 64

#define DATA_PIN 25

#define MUX_CH_COUNT 16
#define PIN_D_MUX_S0 16
#define PIN_D_MUX_S1 17
#define PIN_D_MUX_S2 18
#define PIN_D_MUX_S3 19
#define SIG_0 32
#define SIG_1 33
#define SIG_2 34
#define SIG_3 35

int mux_table[16][4] = {
    {0, 0, 0, 0}, // 0
    {1, 0, 0, 0}, // 1
    {0, 1, 0, 0}, // 2
    {1, 1, 0, 0}, // 3
    {0, 0, 1, 0}, // 4
    {1, 0, 1, 0}, // 5
    {0, 1, 1, 0}, // 6
    {1, 1, 1, 0}, // 7
    {0, 0, 0, 1}, // 8
    {1, 0, 0, 1}, // 9
    {0, 1, 0, 1}, // 10
    {1, 1, 0, 1}, // 11
    {0, 0, 1, 1}, // 12
    {1, 0, 1, 1}, // 13
    {0, 1, 1, 1}, // 14
    {1, 1, 1, 1}  // 15
};

CRGB leds[NUM_LEDS];
int ledsMatrix[8][8] =
    {
        {63, 62, 61, 60, 59, 58, 57, 56},
        {48, 49, 50, 51, 52, 53, 54, 55},
        {47, 46, 45, 44, 43, 42, 41, 40},
        {32, 33, 34, 35, 36, 37, 38, 39},
        {31, 30, 29, 28, 27, 26, 25, 24},
        {16, 17, 18, 19, 20, 21, 22, 23},
        {15, 14, 13, 12, 11, 10, 9, 8},
        {0, 1, 2, 3, 4, 5, 6, 7}};

int hallBoard[8][8];

void setup()
{
  Serial.begin(9600);

  pinMode(PIN_D_MUX_S0, OUTPUT);
  pinMode(PIN_D_MUX_S1, OUTPUT);
  pinMode(PIN_D_MUX_S2, OUTPUT);
  pinMode(PIN_D_MUX_S3, OUTPUT);

  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS); // GRB ordering is assumed
  FastLED.setBrightness(25);
}

void loop()
{

  for (int i = 0; i < MUX_CH_COUNT; i++)
  {
    digitalWrite(PIN_D_MUX_S0, mux_table[i][0]);
    digitalWrite(PIN_D_MUX_S1, mux_table[i][1]);
    digitalWrite(PIN_D_MUX_S2, mux_table[i][2]);
    digitalWrite(PIN_D_MUX_S3, mux_table[i][3]);

    short val0 = analogRead(SIG_0);
    short val1 = analogRead(SIG_1);
    short val2 = analogRead(SIG_2);
    short val3 = analogRead(SIG_3);
    if (i < 8)
    {
      hallBoard[7][i] = val0;
      hallBoard[5][i] = val1;
      hallBoard[3][i] = val2;
      hallBoard[1][i] = val3;
    }
    else if (i > 7)
    {
      hallBoard[6][15 - i] = val0;
      hallBoard[4][15 - i] = val1;
      hallBoard[2][15 - i] = val2;
      hallBoard[0][15 - i] = val3;
    }
  }

  for (int i = 0; i < 8; i++)
  {
    for (int j = 0; j < 8; j++)
    {
      Serial.print(hallBoard[i][j]);
      Serial.print("|");
    }
    Serial.println("");
  };

  Serial.println("");

  for (int i = 0; i < 8; i++)
  {
    for (int j = 0; j < 8; j++)
    {
      if (hallBoard[i][j] > 3350)
      {
        leds[ledsMatrix[i][j]] = CRGB(0, 0, 255);
      }
      else if (hallBoard[i][j] < 2800)
      {
        leds[ledsMatrix[i][j]] = CRGB(255, 0, 0);
      }
      else
      {
        leds[ledsMatrix[i][j]] = CRGB(0, 0, 0);
      }
    }
  }

  FastLED.show();
}