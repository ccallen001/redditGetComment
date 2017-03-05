//get DOM elements
const username = document.querySelector(`input[data-ng-model="username"]`);

//invoke angular
angular.module(`app`, []).controller(`controller`, ($scope, $timeout) => {
    const s = $scope;

    let xhr,
        resp;

    //error handling
    s.tryAnother = () => {
        $timeout(() => {
            s.comment = `Please try another one.`;
            $timeout(() => {
                s.username = null;
                $timeout(() => {
                    username.focus();
                }, 300);
            }, 200);
        }, 1000);
    }

    //http request to retrieve data
    s.getComment = ev => {
        if (!s.username) {
            s.comment = `Plese input a username.`;
            $timeout(() => {
                username.focus();
            }, 0);
            console.log(s.username);
        } else if ((/[^a-zA-Z0-9_-]/gm).test(s.username)) {
            s.comment = `Hmm... That doesn't look like a valid username.`;
            s.tryAnother();
        } else {
            try {
                xhr = new XMLHttpRequest();
                xhr.open(`get`, `https://www.reddit.com/user/${s.username}.json`, false);
                xhr.send();
                resp = JSON.parse(xhr.responseText);

                if (!resp.data) {
                    s.comment = `Oops! That user doesn't seem to exist..`;
                    s.tryAnother();
                } else {
                    s.comment = resp.data.children[0].data.body;
                }
            } catch (err) {
                console.log(err);
                s.comment = `Whoops! There was an error. :(`;
                s.tryAnother();
            }
        }

        if (s.comment == "" || s.comment == null || s.comment == undefined) {
            s.comment = `Whoops! There was an error. :(`;
            s.tryAnother();
        }
    }

    //handles key press on input
    s.checkKey = ev => {
        if (ev.keyCode === 13) {
            s.getComment();
        }
    }
});