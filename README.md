Thingdom JavaScript Library
===========

JavaScript library for v1.1 of the [Thingdom.io API](https://thingdom.io/).

## What is Thingdom?

[Thingdom](https://thingdom.io) enables you to create a mobile app experience using four lines of code and no need to develop your own iOS and Android apps or create your own scalable cloud infrastructure. [Get Started Now!](https://thingdom.io/sign-up)

* Trigger push notifications
* See a feed of messages
* See real-time status information you define
* Customize a view for your Thing with our [Thingdom Developer Portal](https://dev.thingdom.io/), and allow your users to subscribe to your Thing(S) with our Thingdom [iOS](https://itunes.apple.com/us/app/thingdom/id807761969?mt=8) and / or [Android](https://play.google.com/store/apps/details?id=com.thingdom.mobile) apps and use Thingdom in whatever ways you can imagine!

<p align="left">

<img src="http://thingdom.io/images/push_notification.png?raw=true" alt="Alert"/>

<img src="http://thingdom.io/images/profile.png?raw=true" alt="Status Update"/>

</p>

### Ideas for Library Usage

1. Receive push notifications (alerts) with every user form submission
2. Track page views
3. Track button clicks
4. ... what other things would you like to receive alerts for and get status updates on for your website/web app?!

### Usage

__STOP__ You must have a ( free ) Developer API Secret to be able to use this in your own project! __STOP__

If you don't have one yet, you can get one ( free ) from here: https://dev.thingdom.io/get-started

It would be extremely helpful to look at the Thingdom REST API documentation here: https://dev.thingdom.io/docs/api/1.1/

There is some minor configuration necessary on the [Thingdom Developer Portal](https://dev.thingdom.io/) or via [REST API](https://dev.thingdom.io/docs/api/1.1/) to define certain keys you can use for your application.

The *basic* 4 lines code to use this wrapper are: 

#### Authenticate and initialize Thingdom:
```javascript
var thingdom = new Thingdom( 'EnterYourAPISecretHere' );
```

#### Get your Thing:
```javascript
var thing; thingdom.getThing( "thingdom.io formdata", "", function( newThing ) { thing = newThing } );
```

#### Send a feed message 
( this also triggers push notifications in Thingdom ):
```javascript
thing.feed( "new_submission", JSON.stringify( formData ) );
```
Here you could imagine posting a feed of comments to your site, or perhaps you and your team can be alerted with the name, email, and extension of the person requesting help on your company's internal Help Desk site. Share the code for your thing from within Thingdom, or perhaps require permission to view your Thing. 

#### Update your Thing's status:
```javascript
thing.status( "mostRecentFormCompleted", token_vale );
```
You can see your Thing's status in real-time. Here you you could pass some kind value to compare to your feed, or associated database, or your most recent user's high score.

### TODO
***Coming Soon:*** Examples for Usage! How exciting!

***Coming Soom:*** Explanation for usage with ```bower install thingdom-js```
