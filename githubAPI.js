const IDSecret = '?client_id=2e8f86d1d894c0186988' + '&client_secret=40d00772e1ddd4b0dfe59ac92f523b449beae856'

let usedLanguages = [{
        name: "JavaScript",
        color: "#c2b117"
    },
    {
        name: "HTML",
        color: "#df5c25"
    },
    {
        name: "CSS",
        color: "#0a4ea8"
    },
    {
        name: "Python",
        color: "#1b4653"
    },
    {
        name: "TypeScript",
        color: "#2463bb"
    }

]

// Sends a request to api.github.com/users/username/events using the github API with a given username as a parameter and passes the response to a callback function.
function getUserEventsInfo(username, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.github.com/users/" + username + "/events", true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            callback ? callback(response) : null;
        }
    };
    request.send();
}

// Sends a request to api.github.com/users/username/repos/ using the github API with a given username as a parameter and passes the response to a callback function.
function getUserRepositioriesInfo(username, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.github.com/users/" + username + "/repos" + IDSecret, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            callback ? callback(response) : null;
        }
    };
    request.send();
}

// Sends a request to api.github.com/users/username/repoName using the github API with a given username and repoName as a parameter and passes the response to a callback function.
function getRepositoryInfo(username, repoName, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.github.com/repos/" + username + "/" + repoName + IDSecret, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);

            callback ? callback(response) : null;
        }
    };
    request.send();
}


// Sends a request to commitsURL with commitsURL as a parameter and passes the response to a callback function. 
function getCommitsInfo(commitsURL, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", commitsURL + IDSecret, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            callback ? callback(response) : null;
        }
    };
    request.send();
}



function repositoriesCallback(data) {
    for (var i in data) {
        getRepositoryInfo(data[i].owner.login, data[i].name, repoCardConstructor)
    }
}


function repoCardConstructor(repoData) {
    // Creates the repo card
    var gitCard = $("<div>")
    gitCard.addClass("gitCard")


    // Creates the header of the card
    var gitCardHeader = $("<div>");
    gitCardHeader.addClass("gitCardHeader");

    // Creates the repo name
    var repoNamecontainer = $("<div>")
    repoNamecontainer.addClass("repoName")
    repoNamecontainer.text(repoData.name)
    repoNamecontainer.click(function () {
        openLink(repoData.html_url)
    })

    // Creates the repo description
    var repoDescriptioncontainer = $("<div>")
    repoDescriptioncontainer.addClass("repoDescription")
    repoDescriptioncontainer.text(repoData.description)


    // Appends header elements to the header 
    gitCardHeader.append(repoNamecontainer)
    gitCardHeader.append(repoDescriptioncontainer)

    // Creates body of the card
    var gitCardBody = $("<div>");
    gitCardBody.addClass("gitCardBody");

    // Creates the footer of the card 
    var gitCardFooter = $("<div>");
    gitCardFooter.addClass("gitCardFooter");


    // Appends elements to the card
    gitCard.append(gitCardHeader)
    gitCard.append(gitCardBody)
    gitCard.append(gitCardFooter)

    $("#recentProjectsList").append(gitCard);
    // Adds the id to the card 
    gitCard.attr("id", repoData.id)

    addLanguageDataToCard(gitCard, repoData);
}



function addLanguageDataToCard(gitCard, repoData) {
    var request = new XMLHttpRequest();
    request.open("GET", repoData.languages_url + IDSecret, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            var languages = Object.keys(response)
            var languageData = $("<div>");
            var totalCount = 0;
            for (var i in response) {
                totalCount += response[i];
            }
            languageData.addClass("languageData");
            for (var i = 0; i < languages.length; i++) {
                var language = $("<div>");
                language.addClass("language");
                language.text(languages[i] + ": " + Math.ceil(response[languages[i]] / totalCount * 100) + "%");
                languageExists = false;
                language.css("width", Math.ceil(response[languages[i]] / totalCount * 100) + "%");
                if (usedLanguages.map(function (item) {
                        return item.name
                    }).indexOf(languages[i]) === -1) {
                    var tmpObject = {
                        name: languages[i],
                        color: getRandomColor()
                    }
                    usedLanguages.push(tmpObject)
                    language.css("background-color", tmpObject.color)
                } else {
                    language.css("background-color", usedLanguages.filter(function (item) {
                        return item.name === languages[i]
                    })[0].color)
                }



                languageData.append(language);
            }
            gitCard.find(".gitCardFooter").append(languageData);
            addCommitData(gitCard, repoData)
        }
    }
    request.send();
}


function addCommitData(gitCard, repoData) {

    var request = new XMLHttpRequest();
    request.open("GET", repoData.commits_url.replace("{/sha}", "") + IDSecret, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);

            for (var i = 0; i < response.length & i < 3; i++) {
                var commit = response[i];


                var commitRow = $("<div>");
                commitRow.addClass("commitRow");

                var commitMessage = $("<div>");
                commitMessage.addClass("commitMessage");
                commitMessage.text(commit.commit.message);
                commitMessage.click(
                    function () {
                        openLink(commit.html_url);
                    }
                )

                var commitAuthor = $("<div>");
                commitAuthor.addClass("commitAuthor");
                commitAuthor.text(commit.commit.author.name);
                commitAuthor.click(function () {
                    openLink(commit.author.html_url)
                })

                var commitDate = $("<div>");
                commitDate.addClass("commitDate");
                commitDate.text(formatDate(commit.commit.author.date));


                var commitAvatar = $("<img>");
                commitAvatar.addClass("commitAvatar");
                commitAvatar.attr("src", commit.author.avatar_url);
                commitAvatar.attr("alt", commit.author.login);
                commitAvatar.attr("title", commit.author.login);
                commitAvatar.click(function () {
                    openLink(commit.author.html_url)
                })


                commitRow.append(commitMessage);
                commitRow.append(commitDate);
                commitRow.append(commitAuthor);
                commitRow.append(commitAvatar);
                gitCard.find(".gitCardBody").append(commitRow);
                limitToRecentCommits()
            }
        }
    }

    request.send();
}


function limitToRecentCommits() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.github.com/users/" + "Quickzand" + "/events" + IDSecret, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            sortEventsByDate(response)
        }
    };
    request.send();
}

















function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function reverseArray(array) {
    var reversedArray = [];
    for (var i = array.length - 1; i >= 0; i--) {
        reversedArray.push(array[i]);
    }
    return reversedArray;
}


function sortEventsByDate(events) {
    var sortedEvents = events.sort(function (a, b) {
        return new Date(a.created_at) - new Date(b.created_at);
    });
    (extractPushEvents(reverseArray(sortedEvents)));
}

function extractPushEvents(events) {
    var pushEvents = [];
    for (var i = 0; i < events.length; i++) {
        if (events[i].type === "PushEvent") {
            pushEvents.push(events[i]);
        }
    }
    removeOldRepos(pushEvents);
}

function removeOldRepos(pushEvents) {
    var newRepos = [];
    for (var i = 0; i < pushEvents.length; i++) {
        var repo = pushEvents[i].repo.id;
        if (newRepos.indexOf(repo) === -1) {
            newRepos.push(repo);
        }
    }

    newRepos = newRepos.slice(0, 3)
    $(".gitCard:not(#" + newRepos[0] + "," + "#" + newRepos[1] + "," + "#" + newRepos[2] + ")").remove();
    for (var i in newRepos) {
        $("#" + newRepos[i]).appendTo("#recentProjectsList")
    }

}


function removeUsernameFromRepoName(repoName) {
    return repoName.substring(repoName.indexOf("/") + 1);
}


function convertTo12Hours(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function formatDate(date) {
    var date = new Date(date);
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var fullDate = month + "/" + day + "/" + year
    var fullTime = convertTo12Hours(date);
    var timeFromNow = getTimeFromNow(date);
    var formattedDate = fullDate + " at " + fullTime;
    return formattedDate;
}

function getTimeFromNow(date) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date();

    const diffDays = Math.round(Math.abs((date - today) / oneDay));
    if (diffDays === 0) {
        const diffHours = Math.round(Math.abs((date - today) / (60 * 60 * 1000)));
        if (diffHours === 0) {
            const diffMinutes = Math.round(Math.abs((date - today) / (60 * 1000)));
            if (diffMinutes === 0) {
                return "Just Now";
            } else {
                return diffMinutes + " minutes ago";
            }
        }
        return diffHours + " hours ago";
    } else if (diffDays === 1) {
        return "yesterday";
    } else if (diffDays < 7) {
        return diffDays + " days ago";
    } else if (diffDays < 31) {
        return Math.round(diffDays / 7) + " weeks ago";
    }
    return "More than a month ago";

}

getUserRepositioriesInfo("Quickzand", repositoriesCallback);

// getUserEventsInfo("Quickzand", sortEventsByDate)