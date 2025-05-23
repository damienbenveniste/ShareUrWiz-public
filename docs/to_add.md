

To Add before deployment

- ~~fix import statement~~
- ~~add rating after meeting~~
- ~~add primary app bar to routing~~
- ~~make sure all the mobile views work~~
- ~~separate tutor and tutee page and a button to see those~~
- ~~add progress wheel everywhere~~
- ~~add information to understand how to use website~~
- ~~add about us page (Vertical tabs)~~
- ~~add data privacy page (Vertical tabs)~~
- ~~add text in snack bar that to understand the process finished or failed~~
- ~~incorporate company~~
- ~~add onFailure to queries~~
- ~~strengthen the onSuccess process (200 http response)~~
- ~~add button to rate past appointments~~
- change the time added in model to add automatically
- ~~clean useless files~~
- ~~add test and prod public and private keys for payment and other 3rd parties~~
- ~~add all the email confirmations with AWS SES~~
- ~~add control to go everywhere in the app~~
- ~~add tutor page with ID to share~~
- ~~add Redis for prod~~
- ~~add firebase shareyourwiz branding for prod and staging~~
- ~~change branding for tab~~
- ~~rearrange file structure~~
- ~~going to TutorProfile does not need to go through Login~~
- ~~fix "Can't perform a React state update on an unmounted component"~~
- ~~add mixture of passing profile + calling the profile from DB in TutorProfile~~
- ~~in profile page make sure user without tutor profiles are shown~~
- ~~change firebase app to non singleton~~
- ~~remove async from DAO functions~~
- ~~you don't need to be logged in to go to TutorProfile~~
- ~~fix messaging (multiple times the same names)!~~
- ~~add suggestion box~~
- ~~fix "import firebase from 'firebase/app'" warning~~
- ~~check for useless code~~
- ~~fix primaryAppbar and layout~~
- ~~add logo to primaryAppbar~~
- ~~make sure the logout button is present~~
- ~~really learn what "aria" is~~
- ~~something is wrong with the layout (too much space on the right)~~
- ~~make sure the firebase app is fully secured with controled access!~~
- ~~fix all warnings~~
- ~~allow pictures in staging (local)~~
- ~~move Item component to a file~~
- ~~smaller pagination width (at least for mobile)~~
- ~~define custom modal with close button~~
- ~~if create tutor profile check if already exist and send to profile~~
- ~~create profile and request -> protect against empty values~~
- ~~messaging: always default to tutor name if has tutor profile~~
- ~~remove every ";" and replace " by '.~~
- ~~when creating request reload requests with new one~~
- ~~add links to invoice (https://stripe.com/docs/billing/subscriptions/integrating-customer-portal?platform=invoicing)~~
- ~~check that tutor has stripe account activated and provide a button if not~~
- ~~there is something wrong with the rooms being created for no reason~~
- ~~tutor profile is too low for some reason~~
- ~~appointments: only show box if not empty~~
- ~~need to be logged in to take appointment~~
- ~~add term of usage at login~~
- ~~add delete account button~~
- make sure the payment flow works
- ~~provide credit or something if booked apt is cancelled~~
- ~~create staging and prod file media S3~~
- ~~fix set apt layout~~
- ~~fix apt layout in profile~~
- ~~put set set apt in profile card~~
- ~~fix request layout~~
- ~~separate mobile and desktop into separate files or classes or functions~~
- ~~choose a more pastel orange (see amazon) and blue (see gmail app)~~
- ~~bottom drawer for option in mobile (see amazon)~~
- ~~add otherLinks to mobile menu~~
- ~~add "more" button to profile and posts cards~~
- ~~summary box in profile is very ugly~~
- ~~bug in appointments~~
- ~~write time in appointment~~
- ~~remove console.logs~~
- ~~prevent creating appointment if stripe account is not activated~~
- ~~write "no results" if query empty~~
- ~~for tutorprofile have a non logedin version~~
- ~~in tutorprofile select first apt at loading~~
- ~~in tutorprofile check profile exists if not return to home~~
- ~~in tutorprofile if the summary is too long the layout is bad -> overflow~~
- ~~make sure everytime a category is used the number is incremented~~
- ~~handleSnackbarOpen in tutorprofile should be inside calendar~~
- ~~put timestamp on messages~~
- ~~connection errors in messages~~
- ~~try to see if we need to close ws connection~~
- ~~find a way to eliminate rooms that don't have messages without the disconnect function~~
- ~~create room only when the first message~~
- ~~prevent "suggest service" if not tutor~~  
- ~~have button in messaging to reach tutorprofile~~
- ~~TextareaAutosize with defaultvalue and value error~~
- ~~add paragraph on tutor payments in terms~~
- ~~suggest becoming a tutor in profile page~~
- ~~fix the video logic~~
- ~~make sure the meeting is accessible 1 hour after end of meeting~~
- ~~in create account container, have a logic in case the tutor already has the account set up or not~~
- ~~information about pricing fees~~
- ~~information to understand that Stripe handles bank stuff~~
- ~~information about suggestion~~
- ~~information about rating~~
- ~~in tutor and requests feed, categorylist should not allow creating categories~~
- ~~error in price error~~
- ~~prevent being able to book appointments if stripe account do not exist~~
- ~~information on refund policy~~
- ~~information about credit and balance~~
- ~~for refund, apply credit from SYW for next request and pass on the credit cost to the tutor that cancelled https://stripe.com/docs/expand/use-cases#stripe-fee-for-payment ~~
- ~~add a unconfirmed attribute counter to tutor~~
- ~~place callback on confirm failling in appointments~~
- ~~separate tutee and tutor logic to cancel appointment~~
- ~~information about a tutor~~
- ~~information a tutoring request~~
- ~~protect whole api against empty values~~
- ~~provide cost of apt~~
- ~~show balance and credit~~
- for appointment show upcoming appoints until 1 hour after the end

to add after deployment
- cache selectively axios get requests
- add google ads
- isolate better states in components
- implement multi language
- implement multi currencies
- see if we need to use flex wherever possible
- have a create tutor profile button in profile if not tutor
- create blog
- use return axios instead of "onSuccess" "onFaillure"
- collaborative tools https://github.com/securingsincity/react-ace/tree/master#react-ace
https://securingsincity.github.io/react-ace/ https://www.diagrams.net/blog/embedding-walkthrough
https://js.devexpress.com/Demos/WidgetsGallery/Demo/HtmlEditor/Overview/React/Light/
https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/#onRequestEditOperation
- check other website (fb) to see what page could be missing
- badges for new messages and appointments
- createProfileContainer has 3 API calls to backend in a row -> consolidate in 1 call!
- add a "are you sure" when cancelling apt
- can we merge AppointmentView and AppointmentListView in backend?
- need to ensure that variables used in queries are indexed
- Create Employer Identification Number
- fill statement of information doc
- prevent having being able to book appointment if strip account not present in ConfirmAppointmentContainer
- in ConfirmAppointmentContainer handle all the cases for different cards behaviors
- use previous payment method view when paying
- add tooltips to help users
- add calendar with the apts on it (https://devexpress.github.io/devextreme-reactive/react/scheduler/)
- add a refund button for past appointment
- pop video in other tab, leaving the current one for collaboration tool
- use html to improve the quality of the ses emails
- Prevent a tutor to delete an account if he has appointments
- to add date and time to email we need to capture the time zone
- some appointment queries don't use pagination
- Put the snackbar into its own component
- use "less" and "more" like in the post for summary
- can we use only user instead of user + tutor?
- separate firebaseUser from user
- parse linked url on frontend for valid url
- formalize the DAO process
- add api wrapper components
- if user click on meeting too early show a screen that says so
- if appointment does not come out when seting up apt because tutor has a porblem with account tell the user
- when changing picture, have the hovering change the color or something
- send meeting email that gets added to google calendar
- set up logs in cloudwatch
- is invoice setup?
- add adding superuser automatically
- automate deployment
- implement blue-red deployment
- implement an infinite scroll standalone component or check if better implementation exist
- convert object to Data Model class
- type hinting
- add employment and education to profile
- should we have tutoring, coach, and Consulting?
- prevent category list to grow horiizontaly
- currently model.TextField does not capture the blank lines <Typography id="modal-description" sx={{ whiteSpace: 'pre-line'}}>
- for chat pop window when somebody chat with you
- when booking appointment tell user that the payment is not happening right away
- at checkout recover past payment
- classify as past appointment with time margin
- Have the tutor object returning the user object as well
- have the specialties being in bubbles in cards and profile
- deprecate unconfirmed number as we cannot confirm in the past
- add tutor page link in profile page
- change the content in public.index.html
- send emails as callback of the response object
- have chat more available across the app
- add page reloading in EnterPaymentForm if loading is too long
- popup window with the meeting reminder and the button to start the meeting
- capitalize categories in ui
- update appbar when messages are called
- add flexibility to linkedin url input
- diagram https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/
- gamify like kaggle


next focus:
- add "filtering" label to filter
- reuse payment
- add signin promotion $100
<!-- - build a first visit tour -->
- build a nice landing page: https://takelessons.com/
- calendar, up coming apts, not confirmed appoimtnet, messaging
- Email styling, email reminder
- tabs in profile: summary, employment, educations, video embedding
