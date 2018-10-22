(function () {
  var currentURL;
  var displayDate = new Date();

  chrome.storage.sync.get("trackingURL", function (result) {
    currentURL = result.trackingURL;
    console.log("Value currently is " + currentURL);

    $.get({
      url: currentURL,
      success: function (data) {
        console.log(currentURL);
        parseStats(data);
        parseMatchup(data);
        getDateText(displayDate);
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("You have not selected a team to display stats for. Please do so by right-clicking the team page on Yahoo Fantasy's webpage.");
      }
    });
  });

  $(document).ready(function() {
    $("#backButton").click(function(){
      displayDate.setDate(displayDate.getDate() -1);
      getDateText(displayDate);
      reloadTable(displayDate);
      
    });

    $("#forwardButton").click(function(){
      displayDate.setDate(displayDate.getDate() + 1);
      getDateText(displayDate);
      reloadTable(displayDate);

    });
    
    
  });

  function parseStats(data) {
    // Grabs html of table that contains stats
    var playerNodes = $.parseHTML($(data).find("#statTable0").children('tbody')[0].innerHTML);
    // Iterate through each player to pull and display data in own table
    for (i = 0; i < playerNodes.length; i++) {
      let playerInfo = $.parseHTML(playerNodes[i].innerHTML);
      let pos = '<td>' + playerInfo[0].innerText + '</td>';
      // Extracting name and position 
      let temp = playerInfo[2].innerHTML;
      let name = $(temp).find(".Nowrap.name.F-link")[0].innerText;
      let player = '<td>' + name + '</td>';

      let opp = '<td>' + playerInfo[4].innerText + '</td>';
      let status = '<td>' + playerInfo[5].innerText + '</td>';
      let fgm = '<td>' + playerInfo[9].innerText + '</td>';
      let fgper = '<td>' + playerInfo[10].innerText + '</td>';
      let ftm = '<td>' + playerInfo[11].innerText + '</td>';
      let ftper = '<td>' + playerInfo[12].innerText + '</td>';
      let threePt = '<td>' + playerInfo[13].innerText + '</td>';
      let pts = '<td>' + playerInfo[14].innerText + '</td>';
      let reb = '<td>' + playerInfo[15].innerText + '</td>';
      let ast = '<td>' + playerInfo[16].innerText + '</td>';
      let st = '<td>' + playerInfo[17].innerText + '</td>';
      let blk = '<td>' + playerInfo[18].innerText + '</td>';
      let TO = '<td>' + playerInfo[19].innerText + '</td>';
      $('#rostertable tbody').append('<tr>' + pos + player + opp + status + fgm + fgper + ftm + ftper
        + threePt + pts + reb + ast + st + blk + TO + '</tr>');
    }
  }

  function parseMatchup(data) {
    let matchupHTML = $(data).find(".Fz-lg.Ptop-lg.Phone-ptop-med");
    let myScore = matchupHTML[0].innerText;
    let oppScore = matchupHTML[1].innerText;
    // Takes standing away from opponents name
    let oppName = $(data).find(".Inlineblock.Fz-xxs.Pend-sm")[0].innerText;
    let ret = oppName.replace('vs ', '');
    let tmp = ret.replace(/\d+-\d+-\d/, '');

    let matchupTxt = "Your score " + " " + myScore + " vs. " + oppScore + " " + tmp;
    $("#matchup").text(matchupTxt);
  }

  function getDateText(dateObj) {
    var dayText = getDayOfWeek(dateObj);
    var monthText = getMonthName(dateObj.getMonth());
    var fullDate = dayText + ", " + monthText + " " + dateObj.getDate();
    $("#date").text(fullDate);
  }

  function getMonthName(month) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[month];
  }

  function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'][dayOfWeek];
  }

  function reloadTable(dateObj) {
    var specificURL = "/team?&date=";
    var mon = dateObj.getMonth() + 1 >= 10 ? dateObj.getMonth() + 1: "0" + (dateObj.getMonth() + 1);
    var day = dateObj.getDate() >= 10 ? dateObj.getDate() : "0" + dateObj.getDate();
    var date = dateObj.getFullYear() + "-" + mon  + "-" + day;
    var fullURL = currentURL + specificURL + date;    
  }

  


})();