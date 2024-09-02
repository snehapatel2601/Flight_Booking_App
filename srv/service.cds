using { flightbooking } from '../db/schema';

service flightbookingsrv {
 entity Flight as projection on flightbooking.Flight;
entity Booking as projection on flightbooking.Booking;
entity Users as projection on flightbooking.Users;

}
