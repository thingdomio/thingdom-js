Thingdom JavaScript Library
===========

JavaScript library for v1.1 of the [Thingdom.io API](https://api.thingdom.io/1.1).

### What is Thingdom?

[Thingdom](https://thingdom.io) enables you to create a mobile app experience in four lines of code with no need to develop the iOS and Android apps or create scalable cloud infrastructure.  [Get Started Now!](https://thingdom.io/sign-up)

* Trigger Push Notifications
* Receive Real-Time Status Updates in Your Mobile App
* Customize the App with Our Online Designer

<p align="left">

<img src="http://thingdom.io/images/push_notification.png?raw=true" alt="Alert"/>

<img src="http://thingdom.io/images/profile.png?raw=true" alt="Status Update"/>

</p>

### Ideas for Library Usage

1. Receive push notifications (alerts) with every user form submission
2. Track page views
3. Track button clicks
4. ... what other things would you like to receive alerts for and get status updates on for your website/web app?!

### TODO

Implement a JavaScript library that integrates with the Thingdom API and achieve the following:

1. A user should be able to mobile-enable a website/web app without Server-Side integration
2. A user should be able to include the library as easily as using Google Analytics:


        <script> 
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ 
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), 
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) 
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); 
    
            ga('create', 'UA-57348629-1', 'auto'); 
            ga('send', 'pageview'); 
        </script>


3. A user should be able to define their own web 'thing', trigger a push notification (alert), and update its status in four lines of code:


        //Authenticate and Initialize Thingdom
        var thingdom = new Thingdom();

        //Declare A New Unique Thing
        var thing = thingdom.GetThing("Andrew's Printer", "printer");

        //Send A New Feed Message
        thing.Feed("job_finished", "3D print job has finished!");

        //Update The Print Progress %
        thing.Status("progress", "50", "%");
