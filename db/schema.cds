using { managed } from '@sap/cds/common';

namespace flightbooking;

entity Flight:managed{
    key FlightID : UUID @Core.Computed;
    FlightNumber : String(10);
    Source : String(25);
    Destination : String(25);
    DepartureTime : String(20);
    ArrivalTime : String(20);
    TicketPrice : Integer;
    Status : String(25);
    isDeleted:Boolean;
}
entity  Booking : managed {
    key BookingID : UUID;
    FlightID : Association to Flight;
    UserID : Association to Users;
     PassengerName : String;
   PhoneNumber : String;
   Email : String;
    Gender: String;
    BookingDate : Date;
    Class : String;
    BookingStatus : String;
    BookingOrderNumber : String;
   // PassengersDetails : array of PassengersDetails
}
// type PassengersDetails : {
//     passengerName : String;
//     age : Integer;
//     gender : String;

// };

 
entity Users : managed {
    key UserID : UUID @Core.Computed;
    UserName : String;
    key Email : String;
    Password : String;
    Role : String;  // Admin or User
}




