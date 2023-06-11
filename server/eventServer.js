//general citations for this page: https://www.youtube.com/watch?v=w3vs4a03y3I and https://www.youtube.com/watch?v=bhiEJW5poHU
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
//citation start: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
const bcrypt = require('bcrypt');
const saltRounds = 10;
//citation end

//connect to MongoDB cluster here
const uri = "";

const app = express();

//citation start for parsing json: https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
//citation end

async function connect() {
    try {
        await (mongoose.connect(uri));
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

//global variable to be used
let globUsername = "";


//inserting into mongoDb section of code(citation for inserting: https://www.tutorialkart.com/nodejs/mongoose/insert-document-to-mongodb/, citation for retrieving: https://mongoosejs.com/docs/api/model.html#Model.findOne())
const myDB = mongoose.connection;


//mongoDB insertion stuff (schemas and functions):
const userSchema = mongoose.Schema({
    username: String,
    password: String
});

const eventSchema = mongoose.Schema({
    creator: String,
    name: String,
    venue: String,
    date: String,
    time: String,
    unCheckedPeople: Array,
    checkedPeople: Array
});

const messageSchema = mongoose.Schema({
    creator: String,
    eventName: String,
    message: String,
    recipient: String,
});



let User = mongoose.model('users', userSchema);
let Event = mongoose.model('events', eventSchema);
let Message = mongoose.model('messages', messageSchema);


//insert new user into mongoDB
function newUser(newUsername, newPass) {
    //don't allow blank usernames/passwords
    if (!newUsername || !newPass) {
        return false;
    }
    const newUser = new User({
        username: newUsername,
        password: newPass
    });
    newUser.save();
    return true;

}

//insert new event into mongoDB
function newEvent(newName, newVenue, newDate, newTime) {
    //don't allow blank usernames/passwords
    if (!newName || !newVenue || !newDate || !newTime) {
        return false;
    }
    const newEvent = new Event({
        creator: globUsername,
        name: newName,
        venue: newVenue,
        date: newDate,
        time: newTime,
        unCheckedPeople: [String],
        checkedPeople: [String],
    });
    newEvent.save();
    return true;

}

//inserting into mongoDb code end



//post code start (references: https://stackoverflow.com/questions/70403892/how-to-send-data-from-react-js-to-node,
// https://stackoverflow.com/questions/9177049/express-js-req-body-undefined, https://www.youtube.com/watch?v=w3vs4a03y3I)

app.get("/api", (req, res) => {
    res.json({ "users": ["one", "two"] })
})
app.listen(3456, () => { console.log("Server started on Port 3456") })


app.post("/login", jsonParser, (req, res) => {

    //retrieve password from mongoDB
    User.findOne({ username: req.body.username }).exec().then(function (data) {
        //add a null check in case username does not exists
        if (data == null) {
            res.json({ "success": false, "message": "username does not exist" });
        }
        //now check password
        //citation for comparing to hash start: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
        bcrypt.compare(req.body.password, data.password, function (err, result) {
            //citation for comparing to hash end
            if (result) {
                globUsername = req.body.username;
                res.json({ "success": true, "message": "You were able to login!" });
            }
            else {
                res.json({ "success": false, "message": "You were unable to login, check password!" });
            }
        })
    });
})


//create a new user
app.post("/createUser", jsonParser, (req, res) => {
    //retrieve password from mongoDB
    User.findOne({ username: req.body.username }).exec().then(function (data) {
        //check that username already exists
        if (data != null) {
            res.json({ "success": false, "message": "username taken" });
        }
        else {
            let password = req.body.password;
            //hash citation start: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
            bcrypt.hash(password, saltRounds, function (err, hash) {
                //hash citation end
                if (newUser(req.body.username, hash) == true) {
                    res.json({
                        "success": true, "message": "You've Created An Account!"
                    });
                }
                else {
                    res.json({
                        "success": false, "message": "You couldn't create an Account, Make Sure Both Fields are Filled In!"
                    });
                }
            });
        }
    });

})


//create a new event
app.post("/createEvent", jsonParser, (req, res) => {
    if (newEvent(req.body.name, req.body.venue, req.body.date, req.body.time) == true) {
        res.json({
            "success": true, "message": "You've Created An Event!"
        });
    }
    else {
        res.json({
            "success": false, "message": "You couldn't create an Event, Make Sure All Fields are Filled In!"
        });
    }
})

//citations: https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/, https://www.w3resource.com/mongodb/mongodb-array-update-operator-$push.php#:~:text=In%20MongoDB%2C%20the%20%24push%20operator,mentioned%20value%20as%20its%20element, https://www.youtube.com/watch?v=gtUPPO8Re98
//register user for an event
app.post("/registerUser", jsonParser, (req, res) => {
    let shouldInsert = false;
    //check if user is already registered
    Event.findOne({ name: req.body.eventName }).exec().then(function (data) {
        console.log(data);
        // //now check if user is registered
        if (data.unCheckedPeople.includes(globUsername) || data.checkedPeople.includes(globUsername)) {
            console.log("You already here");
            res.json({
                "success": false, "message": "You've Already Registered for This Event!"
            });
        }
        else {
            //findOneAndUpdate needs a promise
            console.log("ready to insert");
            Event.findOneAndUpdate({ name: req.body.eventName }, { $push: { unCheckedPeople: globUsername } }).then(function (data) {
                console.log("updated");
            });
            res.json({
                "success": true, "message": "You've Successfully Registered for This Event!"
            });
        }
    });
})

//unregister user for an event
app.post("/unRegisterUser", jsonParser, (req, res) => {
    let shouldRemove = false;
    //check if user is already registered
    Event.findOne({ name: req.body.eventName }).exec().then(function (data) {
        console.log(data);
        // //now check if user is registered
        if (!data.unCheckedPeople.includes(globUsername) && !data.checkedPeople.includes(globUsername)) {
            res.json({
                "success": false, "message": "You Can't Unregister for an event you're not signed up for!"
            });
        }
        else {
            //findOneAndUpdate needs a promise
            console.log("ready to remove");
            //citation for pulling: https://www.tutorialspoint.com/how-to-remove-element-in-a-mongodb-array#:~:text=To%20remove%20an%20element%2C%20update,that%20match%20a%20specified%20condition.
            if (data.unCheckedPeople.includes(globUsername)) {
                Event.findOneAndUpdate({ name: req.body.eventName }, { $pull: { unCheckedPeople: globUsername } }).then(function (data) {
                });
            }
            else if (data.checkedPeople.includes(globUsername)) {
                Event.findOneAndUpdate({ name: req.body.eventName }, { $pull: { checkedPeople: globUsername } }).then(function (data) {
                    console.log("updated");
                });
            }
            res.json({
                "success": true, "message": "You've Successfully UnRegistered from this Event!"
            });
        }
    });
})

//get events logged in user has created event
app.post("/retrieveEvents", jsonParser, (req, res) => {
    //retrieve events from mongoDB where user is creator
    //citation: https://mongoosejs.com/docs/api/model.html#Model.find()
    Event.find({ creator: globUsername }).exec().then(function (data) {
        //add a null check in case username does not exists
        if (data == null) {
            res.json({ "success": false, "message": "You Have No Events" });
        }
        //now check password
        else if (data.password == req.body.password) {
            res.json({ "success": true, "events": data, "message": "You have events" });
        }
    });
})

//get all events that have been made
app.post("/retrieveAllEvents", jsonParser, (req, res) => {
    //retrieve events from mongoDB where user is creator
    //citation: https://mongoosejs.com/docs/api/model.html#Model.find()
    Event.find({}).exec().then(function (data) {
        //add a null check in case username does not exists
        if (data == null) {
            res.json({ "success": false, "message": "You Have No Events" });
        }
        //now check password
        else if (data.password == req.body.password) {
            res.json({ "success": true, "events": data, "message": "You have events" });
        }
    });
})

//get all events a user is part of 
app.post("/retrieveMyEvents", jsonParser, (req, res) => {
    //retrieve events from mongoDB where user is creator
    //citation: https://mongoosejs.com/docs/api/model.html#Model.find()
    Event.find({}).exec().then(function (data) {
        //add a null check in case username does not exists
        if (data == null) {
            res.json({ "success": false, "message": "You Have No Events" });
        }
        //now check password
        else {
            tmpEvents = [];
            for (let i = 0; i < data.length; ++i) {
                if (data[i].unCheckedPeople.includes(globUsername)) {
                    tmpEvents.push(data[i]);
                }
            }
            res.json({ "success": true, "events": tmpEvents });
        }
    });
})


//get all messages sent to the user by hosts of their event
app.post("/retrieveMessages", jsonParser, (req, res) => {
    //retrieve events from mongoDB where user is creator
    //citation: https://mongoosejs.com/docs/api/model.html#Model.find()
    Message.find({ recipient: globUsername }).exec().then(function (data) {
        //add a null check in case username does not exists
        if (data == null) {
            res.json({ "success": false, "message": "You Have No Events" });
        }
        //now check password
        else if (data.password == req.body.password) {
            res.json({ "success": true, "messages": data, "message": "You have events" });
        }
    });
})


//delete an event
//citation: https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne
app.post("/deleteEvent", jsonParser, (req, res) => {
    Event.deleteOne({ name: req.body.eventName }).exec().then(function (data) {
        res.json({ "success": true, "message": "You have deleted this event!" });
    });
})


//general citations for editing in mongoDB start: https://www.tutorialspoint.com/how-to-remove-element-in-a-mongodb-array#:~:text=To%20remove%20an%20element%2C%20update,that%20match%20a%20specified%20condition.,https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/, https://www.w3resource.com/mongodb/mongodb-array-update-operator-$push.php#:~:text=In%20MongoDB%2C%20the%20%24push%20operator,mentioned%20value%20as%20its%20element, https://www.youtube.com/watch?v=gtUPPO8Re98

//check in a user for an event
app.post("/checkInUser", jsonParser, (req, res) => {
    Event.findOneAndUpdate({ name: req.body.eventName }, { $pull: { unCheckedPeople: globUsername } }).then(function (data) {
        Event.findOneAndUpdate({ name: req.body.eventName }, { $push: { checkedPeople: globUsername } }).then(function (data) {
            res.json({
                "success": true, "message": "You've Checked In this user for This Event!"
            });
        });
    });
})


//check in a user for an event
app.post("/unCheckInUser", jsonParser, (req, res) => {
    Event.findOneAndUpdate({ name: req.body.eventName }, { $pull: { checkedPeople: globUsername } }).then(function (data) {
        Event.findOneAndUpdate({ name: req.body.eventName }, { $push: { unCheckedPeople: globUsername } }).then(function (data) {
            res.json({
                "success": true, "message": "You've Un-Checked In this user for This Event!"
            });
        });
    });
})


//send a message to all users of your event
app.post("/sendMessage", jsonParser, (req, res) => {
    Event.findOne({ name: req.body.eventName, creator: req.body.eventCreator }).exec().then(function (data) {
        //loop through and send messages to all users
        if (data.unCheckedPeople) {
            for (let i = 0; i < data.unCheckedPeople.length; ++i) {
                const newMessage = new Message({
                    creator: "Host " + req.body.eventCreator,
                    eventName: "Their Event " + req.body.eventName,
                    message: req.body.message,
                    recipient: data.unCheckedPeople[i],
                });
                newMessage.save();
            }
        }
        if (data.checkedPeople) {
            for (let i = 0; i < data.checkedPeople.length; ++i) {
                const newMessage = new Message({
                    creator: "Host " + req.body.eventCreator,
                    eventName: "Their Event " + req.body.eventName,
                    message: req.body.message,
                    recipient: data.checkedPeople[i],
                });
                newMessage.save();
            }
        }
        res.json({
            "success": true, "message": "You've Sent The Message to All Your Atendees!"
        });
    });
})

//send a message to creator of an event you are signed up for
app.post("/sendMessagePersonal", jsonParser, (req, res) => {
    //find creator of event and send emssage to them

    const newMessage = new Message({
        creator: "Atendee " + globUsername,
        eventName: req.body.eventName,
        message: req.body.message,
        recipient: req.body.eventCreator,
    });
    newMessage.save();
    res.json({
        "success": true, "message": "You've Sent The Message to the Creator of This Event!"
    });
})


//update an event and send a message to all users informing them of the change
app.post("/updateEvent", jsonParser, (req, res) => {
    //find event and update it
    Event.findOneAndUpdate({ name: req.body.ogName }, { name: req.body.eventName, venue: req.body.eventVenue, date: req.body.eventDate, time: req.body.eventTime }).then(function (data) {
        //loop through and send messages to all users
        console.log(data);
        if (data.unCheckedPeople) {
            for (let i = 0; i < data.unCheckedPeople.length; ++i) {
                const newMessage = new Message({
                    creator: "Host " + req.body.eventCreator,
                    eventName: "Their Event " + req.body.ogName,
                    message: "Event " + req.body.ogName + " Hosted by " + data.creator + " (Renamed to: " + req.body.eventName + "), Has Had Some Details Changed, Please view Your Events to See Specifics",
                    recipient: data.unCheckedPeople[i],
                });
                newMessage.save();
            }
        }
        if (data.checkedPeople) {
            for (let i = 0; i < data.checkedPeople.length; ++i) {
                const newMessage = new Message({
                    creator: "Host " + req.body.eventCreator,
                    eventName: "Their Event " + req.body.eventName,
                    message: "Event " + req.body.ogName + " Hosted by " + data.creator + " (Renamed to: " + req.body.eventName + "), Has Had Some Details Changed, Please view Your Events to See Specifics",
                    recipient: data.checkedPeople[i],
                });
                newMessage.save();
            }
        }
        res.json({
            "success": true, "message": "You've Sent The Message to All Your Atendees!"
        });
    })
})

//general citations for editing in mongoDB end

app.post("/logout", jsonParser, (req, res) => {
    globUsername = "";
    res.json({
        "success": true, "message": "You've Logged Out!"
    });
})



app.post("/retrieveUsername", jsonParser, (req, res) => {
    if (globUsername == "") {
        console.log("not logged in");
        res.json({
            "loggedIn": false,
        });
    }
    else {
        res.json({
            "loggedIn": true, "username": globUsername
        });
    }
})
//post requests code end


