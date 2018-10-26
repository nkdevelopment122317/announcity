var club = $("#giant-at");
var interval = 200;
var count = 0;
var index = 0;
var removing = true;

var clubs = ["stemclub", "basketball", "nnouncity"];

var animation = setInterval(function() {
  var text = club.text().substring(1, club.text().length);
  text = text.split("|")[0];

  if (removing) {
    if (text.length !== 0) {
      removeChar(text);
    } else {
      removing = false;
    }
  } else {
    if (text.length !== clubs[index].length) {
      addChar(text, index);
    } else {
      var limit;

      if (index !== clubs.length - 1) {
        limit = 6;
      } else {
        limit = 10;
      }
      if (count !== limit) {
        interval = 200;
        if (count % 2 === 0) {
          club.text("@" + text + "|")
        } else {
          club.text("@" + text.substring(0, text.length));
        }

        count++;

      } else {
        interval = 250;
        if (index !== clubs.length - 1) {
          index++;
        } else {
          index = 0;
        }
        
        removing = true;
        count = 0;
        removeChar(text);
      }
    }
  }
}, interval);

function removeChar(text) {
  club.text("@" + text.substring(0, text.length - 2) + "|");
}

function addChar(text, index) {
  var nextIndex = text.length;
  club.text("@" + text + clubs[index].charAt(nextIndex) + "|");
}