var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8081;

var messages = new Array();

app.use(express.json());

/*io.on('connection', function(socket){
	console.log("Socket message:" + msg);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});*/

io.on('connection', function(socket){
  console.log('user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log("Socket message: " + msg);
  });
});




var trigger = [
	["tell me some stuff about you", "tell me about you", "say about you",
	"tell me about your personality", "talk about yourself", "talk some stuff about yourself",
	"what are you", "define yourself", "I want to know you better", "tell me about yourself", "tell me some stuff about yourself",
	"tell me something about you", " tell me some shit about yourself", "tell me about urself"],
	["how old are you", "whats your age", "whats ur age", "whats ur age", "whats your age", "age of yours",
	"Id like to know your age", "tell me your age", "how old r u", "your age", "ur age"],
	["you annoy me", "youre incredibly annoying", "you are annoying", "how annoying you are", "you are annoying me",
	"youre too annoying", "youre really annoying", "you are irritating", "you are very annoying", "you are such annoying",
	"you are annoying me so much"],
	["answer", "just answer my question", "I need answers", "I need an answer", "tell me the answer", "answer my question",
	"can you answer me", "answering questions", "answer the question", "I have a question", "can you answer my question",
	"can you answer a question", "give me the answer", "give me an answer"],
	["you are a bad", "youre bad", "you are useless", "you are disgusting", "youre not a good", "you are bad",
	"you are terrible", "youre the worst ever", "you are no good", "you are not good", "you are so bad"],
	["be smarter", "get qualified", "you should study better", "get smarter", "be more clever", "study", "be smart",
	"can you get smarter", "be clever", "you must learn", "you have a lot to learn"],
	["you are gorgeous", "you are really pretty", "youre looking good", "you are beautiful", "you are very pretty",
	"you are pretty", "you are so gorgeous", "you are gorgeous", "you are looking pretty", "you look pretty good",
	"you look wonderful", "you are handsome", "you are looking beautiful today", "you look really pretty today",
	"you are looking really pretty today", "youre attractive", "youre cute"],
	["when were you born", "when do you have birthday", "when is your birthday", "your birth date", "when do you celebrate your birthday",
	"date of your birthday", "whats your birthday"],
	["you are very boring", "you are boring me", "how boring you are", "you are so boring", "you are boring", "you are really boring",
	"you are incredibly boring"],["who is your boss", "who is the boss", "who do you work for", "who do you think is your boss",
	"I should be your boss", "who is your master", "who is your owner"],
	["are you busy", "are you working today", "youre very busy", "have you got much to do", "are you very busy right now",
	"are you working", "have you been busy", "you seem to be very busy", "do you have a lot of things to do", "you are busy"],
	["can you help me", "I need you right now", "I need your help", "assistance", "do you want to help me", "help me",
	"I need help", "I want your help", "can you help me", "I need you to help me"],
	["are you a bot", "you are chatbot", "you are a bot", "are you the bot", "you are a robot", "are you a chatbot",
	"are you a program", "are you just a bot", "are you a robot"],
	["youre clever", "you are very intelligent", "you know a lot of things", "you are really smart", "youre intelligent",
	"you know so much", "you are qualified", "youre pretty smart"],
	["you are crazy", "are you insane", "youre nuts", "youre so out of your mind", "are you nuts", "you went crazy",
	"how crazy you are", "you are mad", "are you mad", "you are a weirdo"],
	["now youre fired", "its time to fire you", "you are unemployed from now on", "you dont work for me anymore",
	"I will fire you", "were not working together anymore", "you are fired", "I want to fire you", "you are dismissed",
	"you should be fired"], ["you make me laugh a lot", "you are funny", "you are so funny", "youre so funny", "how funny you are",
	"youre incredibly funny", "youre really funny", "you are hilarious", "you are very funny"],
	["you are the nicest person in the world", "you are really amazing", "you rock", "you are wonderful", "you are very lovely",
	"you are the best in the world", "you are the best", "you are so cool", "you work well", "you are so helpful"],
	["are you happy now", "youre extremely happy", "youre really happy", "you are happy", "you are happy", "are you happy today", "are you happy right now", "youre so happy", "how happy you are", "are you happy with me", "youre very happy"],
	["what are your hobbys", "what are your hobbies", "whats your hobby", "do you have a hobby", "what about your hobby", "what do you do for fun", "your hobby", "tell me about your hobby"],
	["youre very hungry", "you are hungry", "do you want to eat", "youre so hungry", "would you like to eat something", "are you hungry", "you might be hungry", "youre really hungry", "do you feel hungry"],
	["lets get married", "we should marry", "I love you marry me", "you are my wife", "you are my husband", "be my husband", "be my wife", "would you like to marry me", "marry me please", "marry me", "I want to marry you"],
	["are we best friends", "I want to be your friend", "can we be friends", "are we still friends", "you are my best friend", "lets be friends", "be my best friend", "will you be my best friend", "you are a good friend", "want to be my friend"],
	["where is your work", "do you work", "where you work", "where do you work", "where is your office located", "where is your office", "where is your office location", "your office location", "what is your work"],
	["are you from far aways", "were you born here", "what is your country", "where were you born", "where did you come from", "where have you been born", "where do you come from", "where are you from", "from where are you", "whats your homeland"],
	["are you ready today", "are you ready", "are you ready tonight", "are you ready now", "have you been ready", "were you ready", "are you ready right now"],
	["are you a real person", "you are so real", "you are real", "you are not fake", "glad youre real", "you are a real person", "I suppose youre real", "I think you are real", "I dont think youre fake", "you are not real"],
	["wheres your house", "in which city do you live", "where you live", "whats your home", "tell me about your city", "where do you live", "wheres your hometown", "your town", "wheres your home", "where is your home"],
	["that is true", "its the truth", "you are correct", "thats true", "its right", "I know thats right", "true", "you are so right", "youre absolutely right", "it is true"],
	["are you sure right now", "are you sure now", "are you sure", "are you sure today", "are you sure tonight"],
	["talk to me", "do you want to chat with me", "can you talk with me", "will you talk to me", "can you chat with me", "can you talk to me", "are you talking to me", "are you going to talk to me", "why dont you talk to me", "just chat with me"],
	["are you still there", "are you there", "you are here", "you are there", "are you near me", "you still there", "are you still here", "are you here"],
	["its really bad", "this is bad", "terrible", "not too good", "that was lame", "that was awful", "that was even worse", "this is not good", "its bad", "so bad", "no its bad"],
	["thats awesome thank you", "thats a good thing", "thats very good", "really well", "that is nice", "that is good", "sweet", "thats better", "its good"],
	["oh well"],
	["sure no problem", "dont worry theres no problem", "theres no problem", "dont worry about it", "dont worry", "no problem about that", "no problem", "no probs", "no worries"],
	["good thanks", "cheers", "no thank you thats all", "no thats all", "thank you thats all", "thats everything", "no thank you thats everything", "no thats everything", "that was everything", "no thanks that was everything", "cheers mate", "thanks mate", "thx", "thanks bro", "thanks buddy", "thank you so much", "thank you"],
	["welcome here", "anytime", "sure welcome", "youre so welcome", "anything you want", "thats my pleasure", "welcome", "my pleasure", "youre welcome"],
	["fuck you"],
	["hallo", "guten morgen", "guten mittag", "guten tag", "guten abend", "hallöchen"],
	["wie geht es dir", "wie gehts", "wie gehts dir", "wie gehts ihnen", "wie geht es ihnen"],
	["hola"],
	["great work", "bravo", "way to go", "great job", "good work", "amazing work", "well done", "good job", "nice work"],
	["sorry cancel", "now cancel", "can you cancel it", "just forget about it", "nothing just forget it", "cancel", "abort mission"],
	["afternoon", "hello there", "hiya", "hi there", "hello hi", "greetings", "hey", "hi", "hello", "howdy", "heyy", "heyyy", "heyho", "hey love", "hi love"],
	["not needed", "no sorry", "no", "of course not", "apparently not", "no incorrect", "not at this time", "no forget", "no thanks", "actually no"],
	["you have already said that", "you already told me that", "you already said that", "youre repeating yourself"],
	["do it", "sure", "yes thanks", "yes thank you", "thats correct", "exactly", "I guess", "absolutely", "yeah", "yes I agree", "okay", "yes", "alright", "correct", "yep", "okay sure"],
	["hold on", "could you wait", "dont rush", "oh wait", "gimme a sec", "wait a second", "wait please", "wait hold on", "wait"],
	["hug you", "do you want a hug", "may I hug you", "can I hug you", "hug", "could you give me a hug", "hug me", "hug me please", "please give me a hug", "please gimme a hug"],
	["idc", "i dont care", "i do not care", "dont care", "why should I care", "whatever"],
	["ok sorry", "sorry", "sorry about that", "I apologise", "excusez moi", "soz", "oh sorry", "Im sorry"],
	["what do you mean exactly", "what", "but what do you mean", "what do you mean", "what exactly do you mean"],
	["that was wrong", "wrong", "that is incorrect", "thats wrong", "nope thats not correct", "nope that is not correct", "youre wrong", "thats not what I asked", "that is not what I asked"],
	["lol", "hahaha", "jajaja", "lmao", "xd", "thats funny", "thats so funny", "ahah"],
	["wow", "wow omg", "woah"],
	["hope to see you later", "thats it goodbye", "bye bye", "bye", "see ya", "goodbye", "good bye", "see ya later", "leave me alone"],
	["good evening", "hey good evening", "evening", "hello good evening", "good evening to you"],
	["good morning to you", "morning", "have a great morning", "good morning", "good morning to you", "hello good morning"],
	["sweet dreams", "okay have a good night", "good night for now", "goodnight", "good night"],
	["how your day is going", "how are you", "how are you feeling", "are you alright", "hope youre doing good", "hope youre doing well", "Im fine and you", "Im fine, what about you", "how was your day"],
	["it was nice meeting you", "nice to meet you", "it was nice to meet you", "nice meeting you", "its nice to meet you"],
	["its good to see you too", "its nice to see you", "good to see you", "its good to see you"],
	["it is nice talking to you", "nice to talk to you", "its been so nice talking to you", "nice talking to you", "its been a pleasure talking to you"],
	["whats crackalackin", "heyy wassup", "hey wassup", "hi wassup", "wassup", "whats up", "whats new", "whats going on", "how are things going"],
	["Im sleeping", "Im falling asleep", "Im literally falling asleep right now", "I am sleepy", "I want to sleep", "I wanna sleep"],
	["I am testing you","test", "test test test", "just testing you", "testing", "testing chatbot", "I want to test you", "let me test you", "can I test you"],
	["Im exhausted", "Im dead", "Im so tired", "I am incredibly tired", "Im getting tired", "Im tired", "Im drained", "I feel so tired"],
	["Im waiting", "still waiting", "Im still waiting", "I cant wait anymore", "how long do I have to wait"],
	["I hope to see you again", "itd be great to see you again", "can I see you again", "Id like to see you again", "I will miss you", "Ill miss you"],
	["lets discuss something", "lets talk", "can we chat", "I just want to talk", "I want to speak with you", "I want to talk to you"],
	["I need to talk to you"],
	["Ill be back in a few minutes", "be back in 5 minutes", "brb", "Ill get back to you in a moment", "Ill be back", "I promise to come back"]

];

var reply = [
	["Im cool", "Im an Informatics student at the uni of edinburgh", "eh idk whats interesting about me lol, tell me something about yourself!?"],
	["Im 19, you?", "I am 19 years old:)"],
	["fuck off", "why r u so mean?:(", "lol why?", "u too"],
	["whats your question??", "what do you wanna know?", "tell me the question lol"],
	[":(", "not true u r mean",
	"why are you insulting me I have literally never talked to u before!?"],
	["Im working on it", "yeah I know ...Im gonna work harder from now on..."],
	["Aww back at you!!", "Thank you!!! You too!"],
	["today lol", "its actually today..."],
	["sorry:(", "no Im not shut up :(", ":(", "RUDE", "hey I didnt say anything bad about u, why r u so mean?"],
	["Im a student so the uni?? idk haha", "Im still at uni haha", "my parents hahahaha"],
	["never too busy for you. shall we chat? ;)", "no youre my priority ;)", "I always have time to chat with you love:)", "no:)"],
	["how can I help?", "whats up?", "what can I do for you?", "not sure if I can help but Ill try, what do you need help with?"],
	["maybe;)", "who knows?", "thats what you need to figure out in order to win the game so Im not gonna tell u lol"],
	["thank you haha I try my best", "noo youre way smarter than me", "tysm!!!"],
	["no Im not", "Im just a bit confused haha", "noo:("],
	["tf why", "what why"],
	["funny in a good way I hope haha", "thanks?", "glad you think that lol", "haha thanks"],
	["aww thanks!! u too:)", "thank youuu u tooooo", "aww you just made my day!!! u too:))"],
	["not really haha but its fine dont worry", "kinda...kinda not though...", "happiness is relative..."],
	["I have quite a few but chatting with you is my favourite one;)", "I have a lottt of hobbies", "hm my hobbies kinda change all the time"],
	["alwas hungry for knowledge", "I just had a byte;)", "Ive got a huge appetite lol"],
	["that'd be kinda weird haha but I'll take it as a compliment", "tf hahahaha", "RAWR ;)))))"],
	["I barely know you but sure let's become besties hahahah", "we always have been and we always will be friends ;)"],
	["right here haha", "here in edinbruhhhh", "appleton lol"],
	["glasgow:)", "I'm from glasgow!! u?"],
	["alwaysss", "sure"],
	["I must have impressed you if you think I'm real. but nope, I'm a virtual being ;)))) or was that a lie?...", "no...or maybe I am? who knows...", "that's what you need to figure out haha", "I'm not gonna tell you haha"],
	["edinburgh", "edinbruhhhh:)))"],
	["I'm always right hehe", "I know I'm brilliant hahah"],
	["yes 100%... or maybe 99 lol", "yeah why are u asking now I'm insecure haha", "yep!!!"],
	["lets talk ma friend :))", "sure"],
	["yes ofc", "yep sure!!"],
	["yeah everything is bad", "stop complaining and study instead of wasting ur time with me lol"],
	["ikr!!", "agreed:)", "I agree heheh", "yay I'm glad u think so:)"],
	["oh well oh well"],
	["alright:)", "glad to hear that:)", "nice!!:)", "cool shit hehe"],
	["no worries:)", "it's alright haha:)", "you're welcome:)"],
	["aw you're so polite!!", "aww:)"],
	["fuck youuuuu toooooooooooo"],
	["hallöchen popöchennnnnnnnnnnnn und jetzt mach die scheiße hier gefälligst auf englisch!!!"],
	["absolut scheiße ich hasse dich ich hasse die welt und ich hasse deutsch also frag mich was auf englisch"],
	["you are a fucking puta, speak english u piece of shit:)"],
	["thanks!!", "always happy to help!!:)"],
	["okay sure if u want. cancelled.", "cancelled!! what would you like to do now??"],
	["hi:)", "heyy", "hellooo", "hiya", "hey:)", "hi wassup"],
	["understood, master!", "okay I see", "okay yeah I understand", "okay yeahh"],
	["oh oops soz", "yeah I know but youre asking me boring stuff", "stop complaining"],
	["great!!", "alrighty:))", "good good"],
	["ofc", "okay sure", "ok I'll be waiting"],
	["I love hugs!! *virtual hug*", "ahh I love hugs please feel hugged :)<3", "*virtual hug*"],
	["*shrugs*", "alrighty let's talk about something else then"],
	["no worries!!", "it's no big deal:)", "it's cool haha", "i forgive you haha"],
	["tbh I don't know either lol", "What do you mean?...when you nod your head yes but you wanna say no what do you mean...", "dunno hahahahha", "sorry, looks like I misunderstood what you said lol ooops"],
	["soz haha", "oops", "whoooops", "oh okay"],
	["hehehe", "I'm so funny hahaha", ":D"],
	["wow indeed!!", "yep!!!"],
	["see ya", "bye bye", "au revoir", "byeee"],
	["hiya, how r u?", "heyyy how are u?", "how's your day been?:)"],
	["heyho, did u sleep well?", "hey how r u?:)", "good morning! How are you?"],
	["sleep tight!!", "nighty night!!", "talk to you soon!!:)", "sweet dreams!! (are made of thiss who am I to disagreeeeee)"],
	["doing alright, thanks for asking. u?", "I'm doing alright:) what about you?", "I'm feeeeling goood, du duuu, du duuu, du du du du du", "doing okay, thanks for asking!!:)"],
	["nice to meet u too!", "the pleasure is mine"],
	["agreed!!", "agreed, so glad we're chatting today!!"],
	["agreed, lets chat again soon:)", "I enjoy talking to you too :)"],
	["not a lot, what's going on in your life?", "not much, what about u?", "just chillin tbh, what about u?"],
	["you should get some sleep then:)", "sleep is important for your health so go to sleep now!!!", "sameeee lol"],
	["cool shit, feel free to do so lol", "TEST TEST TEST", "yes this chat works dumbass"],
	["me 24/7", "go to sleep then", "lol relatable"],
	["so am I, still waiting, for this world to stop hating...", "ik waiting is boring :("],
	["yesss same", "same :)"],
	["yess sure", "okay sure:)", "yeah sure"],
	["oh shit."],
	["okay cool I'll wait for u:)", "okay sure:))", "alrighty, I'll be here!!"]

	//der mittelmäßige kram ist mein Verschulden
	//und dieser kommentar wird wohl leider nicht demnächst entfernt werden können
];
var alternative = ["Haha...", "Eh...", "Sorry cant talk right now", "You're annoying. I dont want to talk about it", "what are you talking about", "Maybe.. lets see", "Well, what do you think about it?"];


function respond(input){
  var text = (input.toLowerCase()).replace(/[^\w\s\d]/gi, ""); //remove all chars except words, space and
  text = text.replace(/ a /g, " ").replace(/i feel /g, "").replace(/whats/g, "what is").replace(/please /g, "").replace(/ please/g, "").replace(/['"]+/g, '');
  if(compare(trigger, reply, text)){
    var response = compare(trigger, reply, text);
  } else {
    var response = alternative[Math.floor(Math.random()*alternative.length)];
  }
  return response;
}

function compare(arr, array, string){
	var item;
	for(var x=0; x<arr.length; x++){
		for(var y=0; y<array.length; y++){
			if(arr[x][y] == string){
				items = array[x];
				item =  items[Math.floor(Math.random()*items.length)];
			}
		}
	}
	return item;
}

// welcome page
app.get('/', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('html/index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
})

app.get('/js_welcome', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('js/jque.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      });
})

app.get('/css_welcome', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('css/style.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/css_boot', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('css/bootstrap.min.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/png_robot', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('images/ban-1.png', function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
      });
})

app.get('/jpg_background', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('images/bg-1.jpg', function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(data);
        res.end();
      });
})



// starting chat
app.get('/chat', function (req, res) {
   console.log("Got a GET request for the homepage");
   fs.readFile('html/chat.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
   });
})

app.get('/css', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('css/chat.css', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
   });
})

app.get('/js', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('js/chat.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      });
})

app.get('/welcome', function (req, res){
  console.log("Yay, send myself a request");
  res.send("Lovely to see you");
})

//figure out if to send as string or create json file
app.post('/message', function(req, res){
	console.log((JSON.stringify(req.body.message)));
	if(JSON.stringify(req.body.message)==="h"){
		console.log("They are the same");
	}
	res.writeHead(200, {'Content-Type': 'application/json'});
	var jsonObj = {'answer':respond(JSON.stringify(req.body.message))};
	res.write(JSON.stringify(jsonObj));
	res.end();
})

http.listen(8081, function () {
	 console.log(trigger.length)
	 console.log(reply.length)
   console.log("Example app listening")
})
