import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./manageEvents.css"



function ManageEvents() {
    //citation for routing using js start: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
    const navigate = useNavigate();
    function goLogin() {
        navigate("/login");
    }

    function goHome() {
        navigate("/home");
    }
    //citation for routing using js end


    function reload(){
        //reload citation start: https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react
        window.location.reload(false);
        //reload citation end
    }


    //function to check in user to an event
    function checkInUser(user,eventName){
        const data = { "username": user, "eventName" : eventName};
        console.log(data);
        fetch("/checkInUser", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? reload() : alert(data.message)))
            .catch(err => console.error(err));
    }

    //function to un-check in a user
    function unCheckInUser(user, eventName) {
        const data = { "username": user, "eventName": eventName };
        console.log(data);
        fetch("/unCheckInUser", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? reload() : alert(data.message)))
            .catch(err => console.error(err));
    }


    //function to edit an event
    function editEvent(eventName,eventVenue,eventDate,eventTime,eventCreator) {
        //get all the changes to be made and update if necessary
        let newEventName = document.getElementById(eventName + "name").value;
        let newEventVenue = document.getElementById(eventName + "venue").value;
        let newEventDate = document.getElementById(eventName + "date").value;
        let newEventTime = document.getElementById(eventName + "time").value;
        if (!newEventName && !newEventVenue && !newEventDate && !newEventTime){
            alert("No changes made!");
            return;
        }
        if(!newEventName){
            newEventName = eventName;
        }
        if (!newEventVenue) {
            newEventVenue = eventVenue;
        }
        if (!newEventDate) {
            newEventDate = eventDate;
        }
        if (!newEventTime) {
            newEventTime = eventTime;
        }
        const data = { "eventCreator" : eventCreator, "ogName" : eventName, "eventName": newEventName, "eventVenue": newEventVenue, "eventDate": newEventDate, "eventTime": newEventTime, };
        console.log(data);
        fetch("/updateEvent", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? reload() : alert(data.message)))
            .catch(err => console.error(err));
    }


    //function to delete an event
    function deleteEvent(eventName) {
        const data = { "eventName": eventName };
        console.log(data);
        fetch("/deleteEvent", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? reload() : alert(data.message)))
            .catch(err => console.error(err));
    }

    //function to send a message to all users signed up for an event
    function sendMessage(eventName,eventCreator){
        let msg = document.getElementById(eventName).value;
        if (!msg){
            alert("Message cannot be empty");
            return;
        }
        const data = { "eventName": eventName , "eventCreator" : eventCreator, "message" : msg};
        fetch("/sendMessage", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? alert(data.message) : alert(data.message)))
            .catch(err => console.error(err));
    }



    //react hook citation: https://legacy.reactjs.org/docs/hooks-effect.html
    const [username, setUsername] = useState("");
    const [events,setEvents] = useState([{}]);

    //check if logged in, and if so set username, else redirect
    fetch("/retrieveUsername", {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => console.log(data.loggedIn ? setUsername(data.username) : goLogin()))
        .catch(err => console.error(err));

//citation for retrieving from backend start: https://www.youtube.com/watch?v=w3vs4a03y3I
useEffect (() =>{
    fetch("/retrieveEvents", {
        method: 'POST',
    }).then(
        response => response.json()
      ).then(
        data =>{
          setEvents(data);
        }
      )

    },[])
    console.log(events);
//citation for retrieving from backend end

    // citation start: https://legacy.reactjs.org/docs/lists-and-keys.html

    const eventItems = (events.events)?.map((event, i) =>
    <div key = {i} className="event">
            <h1>Event: {event.name}</h1>
            <textarea type="text" id = {event.name} placeholder="Message to Send to All Attendees"/>
            <button classname="check" onClick={() => sendMessage(event.name,event.creator)}>Send Message</button>
        <div>Venue: {event.venue}</div>
        <div>Date: {event.date}</div>
        <div>Time: {event.time}</div>
            {/* citation: https://forum.freecodecamp.org/t/mapping-an-array-within-a-mapped-array/229335/2 */}
        <p>Unchecked Users:</p>
        {event.unCheckedPeople.map(unChecked =>(
            <div className="ind">
            <p key={unChecked}>{unChecked}</p>
            <button className="check" onClick={() => checkInUser(unChecked,event.name)}>Check In</button>
            </div>
        ))}
        <p>Checked Users:</p>
            {event.checkedPeople.map(checked => (
                <div className="ind">
                    <p key={checked}>{checked}</p>
                    <button className="unCheck" onClick={() => unCheckInUser(checked, event.name)}>UnCheck In</button>
                </div>
            ))}
            <p>Edit Your Event:</p>
            <input type="text" id={event.name + "name"} placeholder="New Name"/>
            <input type="text" id={event.name + "venue"} placeholder="New Venue" />
            <input type="text" id={event.name + "date"} placeholder="New Date" />
            <input type="text" id={event.name + "time"} placeholder="New Time" />
            <br />
            <button onClick={() => editEvent(event.name,event.venue,event.date,event.time,event.creator)}>Apply All Changes</button>
            <br />
        <button className ="unCheck" onClick={() => deleteEvent(event.name)}>Delete Event</button>
        <hr />
    </div>
    );
    // citation end


    return (
        <div className="main">
            <button onClick={goHome} className="homeButton">Back to Home</button>
            <br />
            <div className="title">Event Management Page</div>
            <div className="username">Welcome User {username}</div>
            <h1>Your Events: </h1>
            <hr />
            <ul>{eventItems}</ul>
        </div>

    )
}

export default ManageEvents;