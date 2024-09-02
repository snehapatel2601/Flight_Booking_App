using { managed } from '@sap/cds/common';

namespace flightbooking;

entity Flight:managed{
    key FlightID : UUID @Core.Computed;
    FlightNumber : String(10);
    Source : String(25);
    Destination : String(25);
    DepartureTime : String(20);
    ArrivalTime : String(20);
    TicketPrice : Decimal;
    Status : String(25);
}
entity  Booking : managed {
    key BookingID : UUID;
    FlightID : Association to Flight;
    UserID : String;  // or Association to User
    PassengerName : String;
    PassengerCount : Integer;
    ContactInfo : String;
    BookingDate : Timestamp;
    BookingStatus : String;
    BookingOrderNumber : String;
}
 
entity Users : managed {
    key UserID : UUID @Core.Computed;
    UserName : String;
    Email : String;
    Password : String;
    Role : String;  // Admin or User
}




