#include <FirebaseESP32.h>
#include <Wire.h>
#include "DHTesp.h"
#include "NMEA.h"

#define FIREBASE_HOST "https://vlccntt-final-project-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "CgzLRjzEmlMdPclVUqc2Le9ozxldu3BMqPBezE8m"

#define alto 64
#define ancho 128

#define WIFI_SSID "Wokwi-GUEST" // Thay đổi tên wifi của bạn
#define WIFI_PASSWORD ""        // Thay đổi password wifi của bạn

int sensorPin = 34;
const int DHT_PIN = 32;
DHTesp dhtSensor;

String latitudeArr[] = {"10.762987436925338", "10.795131100527945", "21.03705750058388", "16.061367185643345", "16.453334512870114", "19.812827417741886", "15.121193277041515"};
String longitudeArr[] = {"106.6824800918965", "106.72184940246694", "105.83460232357466", "108.22745791586112", "107.54496052125019", "105.77074648694543", "108.7816666830083"};

union
{
    char bytes[4];
    float valor;
} velocidadeGPS;

float latitude;
float longitude;

NMEA gps(GPRMC);

FirebaseData fbdo;
FirebaseData fbdo1;

void setup()
{
    Serial.begin(9600);
    delay(1000);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD); // Bắt đầu kết nối WiFi.
    Serial.print("Dang ket noi");         // In ra màn hình kết nối đang được thực hiện.
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print("."); // đây là lệnh in một dấu chấm trên Serial Monitor của Arduino IDE, để biểu thị rằng thiết bị đang kết nối WiFi.
        delay(500);
    }

    Serial.println("");                 // đây là lệnh in một dòng trống trên Serial Monitor
    Serial.println("Da ket noi WiFi!"); // đây là lệnh in ra màn hình Serial Monitor thông báo rằng thiết bị đã kết nối thành công với một mạng WiFi.
    Serial.println(WiFi.localIP());
    // Khởi tạo cấu hình Firebase
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    // DHT22 setup
    dhtSensor.setup(DHT_PIN, DHTesp::DHT22);
    // GPS setup
    // Serial1 is connected to the custom GPS chip
    Serial.println("Data received from GPS Fake:");
}

void loop()
{

    // MQ135 gas sensor
    int lecturaMQ135 = analogRead(sensorPin);
    delay(500);

    float ppm = 1200.0 / 1023.0;
    float co = ppm * lecturaMQ135;
    Serial.print("Monoxido de carbono: ");
    Serial.print(co);
    Serial.println(" ppm");
    delay(1000);

    if (co <= 350)
    {
        Serial.print("Qualidade do ar alta");
    }
    else if (350 < co && co <= 800)
    {
        Serial.print("Qualidade do ar moderada");
    }
    else if (800 < co && co <= 1200)
    {
        Serial.print("Qualidade do ar baixa");
    }
    else
    {
        Serial.print("Má qualidade do ar");
    }

    // DHT22 sensor
    TempAndHumidity data = dhtSensor.getTempAndHumidity();
    Serial.println("Temp: " + String(data.temperature, 2) + "°C");
    Serial.println("Humidity: " + String(data.humidity, 1) + "%");
    delay(2000);

    // GPS
    while (Serial.available())
    {
        char serialData = Serial.read();
        Serial.print(serialData);

        if (gps.decode(serialData))
        {
            if (gps.gprmc_status() == 'A')
            {
                velocidadeGPS.valor = gps.gprmc_speed(KMPH);
            }
            else
            {
                velocidadeGPS.valor = 0;
            }

            latitude = gps.gprmc_latitude();
            longitude = gps.gprmc_longitude();

            Serial.println();
            Serial.println();

            Serial.print(" Latitude: ");
            Serial.println(latitude, 8);

            Serial.print("Longitude: ");
            Serial.println(longitude, 8);

            Serial.print("    Speed: ");
            Serial.print(velocidadeGPS.valor);
            Serial.println(" Km/h");

            convertCoordinatesToCartesian(latitude, longitude);
        }
    }
    // Light sensor
    int lightvalue = analogRead(A0);
    lightvalue = map(lightvalue, 1023, 0, 0, 100);

    Serial.println("Brightness:");
    Serial.print(lightvalue);
    Serial.print("%");
    // Gửi dữ liệu lên Firebase
    sendDataToFirebase(co, data.temperature, data.humidity, latitude, longitude, velocidadeGPS.valor, lightvalue, latitudeArr, longitudeArr);
    delay(5000);
}

void convertCoordinatesToCartesian(float latitude, float longitude)
{
    float latRadius = latitude * (PI / 180);
    float lonRadius = longitude * (PI / 180);

    int earthRadius = 6371;

    float posX = earthRadius * cos(latRadius) * cos(lonRadius);
    float posY = earthRadius * cos(latRadius) * sin(lonRadius);

    Serial.print("        X: ");
    Serial.println(posX);
    Serial.print("        Y: ");
    Serial.println(posY);
}

void sendDataToFirebase(float co, float temperature, float humidity, float latitude, float longitude, float speed, float lightvalue, String latitudeArr[], String longitudeArr[])
{
    int randomIndex = int(random(7));
    String latVal = latitudeArr[randomIndex];
    String longVal = longitudeArr[randomIndex];
    Firebase.setFloat(fbdo, "/weather/cacbon_monoxide", co);
    Firebase.setFloat(fbdo, "/weather/temperature", temperature);
    Firebase.setFloat(fbdo, "/weather/humidity", humidity);
    Firebase.setString(fbdo, "/weather/latitude", latVal);
    Firebase.setString(fbdo, "/weather/longitude", longVal);
    Firebase.setFloat(fbdo, "/weather/wind_spedd", speed);
    Firebase.setFloat(fbdo, "/weather/lightvalue", lightvalue);
}