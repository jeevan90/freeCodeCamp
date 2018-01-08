// https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js

// TO DO
//
// 1. FIX RANDOM ARTICLE VIEWER SO IT ACTUALLY LOADS 😅
// 2. FIX SEARCH KEYWORD HIGHLIGHT SO IT:
//    A. WORKS PROPERLY, AND
//    B. DOESN'T OVERFLOW BUFFER 😒
// 3. FIX IT SO RESULTS END UP IN THE PROPER ORDER!
// 4. POLISH OFF STUFF SO IT LOOKS EVEN BETTER!! 😎

$(()=>{ // jQuery document.ready

  const articles = $("#articles ul"),
        input = $("input"),
        random = $("#random"),
        search = $("#search"),
        Wikipedia = "https://en.wikipedia.org",
        WP_API = Wikipedia + "/w/api.php";

  const queryAPI = terms => {
    $.ajax({
      url: WP_API,
      // url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + input.val() + "&format=json&srprop=snippet&prop=info&inprop=url&srlimit=1",
      dataType: "jsonp",
      // data: {
      //   action: "query",
      //   format: "json",
      //   list: "search",
      //   utf8: 1,
      //   srsearch: input.val(),
      //   origin: "*",
      //   srlimit: 5
      // },
      data: {
        action: "query",
        exchars: 455,
        exintro: true,
        exlimit: "max",
        explaintext: true,
        format: "json",
        generator: "search",
        gsrlimit: 1,
        gsrnamespace: 0,
        gsrsearch: terms,
        pilimit: "max",
        piprop: "thumbnail",
        pithumbsize: 256,
        prop: "extracts|pageimages"
      },
      success: data => {
        $.map(data.query.pages, result => {
          // if highlight didn't maintain proper case, split() and join() on input.val() would work
//           var titleMatch = result.title.toLowerCase().indexOf(input.val().toLowerCase()),
//               titleHighlight = titleMatch !== -1 ?                                                   // if a string match exists, highlight it
//                 result.title.substr(0, titleMatch) + "<span class='searchmatch'>" +                  // before match start + start searchmatch
//                 result.title.substr(titleMatch, input.val().length()) + "</span>" +                  // part which matches + ends searchmatch
//                 result.title.substr(titleMatch + input.val().length(), result.title.length()) : "",  // after match ends + closes out ternary
//               descrMatch = result.extract.toLowerCase().indexOf(input.val().toLowerCase()),
//               descrHighlight = descrMatch !== -1 ?                                                       // if a string match exists, highlight it
//                 result.extract.substr(0, descrMatch) + "<span class='searchmatch'>" +                    // before match start + start searchmatch
//                 result.extract.substr(descrMatch, input.val().length()) + "</span>" +                    // part which matches + ends searchmatch
//                 result.extract.substr(descrMatch + input.val().length(), result.extract.length()) : "";  // after match ends + closes out ternary

//           console.log("inputVal: " + input.val());
//           console.log("title: " + result.title);
//           console.log("extract: " + result.extract);
//           console.log("highlight: " + titleHighlight);
//           console.log("descr: " + descrHighlight);

          var title = result.title.split(input.val()).join("<span class='searchmatch'>" + input.val() + "</span>"),
              descr = result.extract.split(input.val()).join("<span class='searchmatch'>" + input.val() + "</span>");
          var li = $('<li>');
          li.append($("<a>").attr("href", Wikipedia + "/wiki/" + result.title).attr("target", "_blank")
            .append($("<h2>").html(title))
            .append(result.thumbnail ? $("<img>").attr("width", 128).attr("src", result.thumbnail.source) : "")
            .append($("<p>").html(descr)));

          // $(li + ":contains(" + input.val() + ")").html((_, html) => {
          //   return html.split(input.val()).join("<span class='searchmatch'>" + input.val() + "</span>");
          // });
          articles.empty().append(li).hide().fadeIn(284);

          //           console.log("original title: "+result.title);
          //           console.extract("original title: "+result.extract);
          //           var newTitle = result.title.split(input.val()).join("<span class='searchmatch'>"+input.val()+"</span>");

          //           var newExtract = result.extract.split(input.val()).join("<span class='searchmatch'>"+input.val()+"</span>");
          //           console.log("new title: "+newTitle);
          //           console.extract("new title: "+newExtract);

          // $("body *:contains("+input.val()+")").html(function(_, html) {
          //   return html.split(input.val()).join("<span class='searchmatch'>"+input.val()+"</span>");
          // });
          // var el = $('<li>');
          // el.append($("<a>").attr("href",Wikipedia+"/wiki/"+result.title).attr("target", "_blank").append($("<h2>").text(result.title)).append(result.thumbnail ? $("<img>").attr("width", 128).attr("src", result.thumbnail.source) : "").append($("<p>").text(result.extract)));
          // articles.empty().append(el).hide().fadeIn(284);
        });
      }
    });
  },
        queryAPIRandom = () => {
            $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=5&titles=&callback=?", data => {
              $.map(data.query.random, result => {
                // console.log(result.title);
                articles.empty().append($('<li>').attr("class", "random").append($("<a>").attr("href", Wikipedia + "/wiki/" + result.title).attr("target", "_blank").append($("<h2>").html(result.title)))).hide().fadeIn(284);
              });
            });

          // $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=15&titles=&callback=?", data => {
          //   $.map(data.query.random, result => {
          //     articles.empty()
          //       .append($('<li>')
          //         .append($("<a>").attr("href", Wikipedia + "/wiki/" + result.title).attr("target", "_blank")
          //           .append($("<h2>").html(result.title))
          //         )
          //       ).hide().fadeIn(284);
          //   });
          // });
          // $.ajax({
          //   url: WP_API,
          //   dataType: "json",
          //   data: {
          //     action: "query",
          //     format: "json",
          //     formatversion: 2,
          //     list: "random",
          //     rnnamespace: 0,
          //     rnlimit: 5,
          //     titles: "",
          //     callback: ""
          //   },
          //   success: data => {
          //     // console.log(data);
          //     $.map(data.query.random, result => {
          //       var el = $("<li>");
          //     el.append($("<a>").attr("href",Wikipedia+"/wiki/"+result.title).attr("target", "_blank").append($("<h2>").text(result.title)).append(result.thumbnail ? $("<img>").attr("width", 128).attr("src", result.thumbnail.source) : "").append($("<p>").text(result.extract)));
          //       articles.empty().append(el).hide().fadeIn(284);
          //     });
          //   }
          // });
        };

  input.on("input", doSearch);
  search.on("submit", e => { e.preventDefault(); doSearch(); });
  random.click(e => { e.preventDefault(); queryAPIRandom(); });
  function doSearch(e){  queryAPI(input.val()); }
});