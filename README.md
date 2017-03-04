# redditGetComment
Allows you to specify a reddit user and get their latest comment.

<html>

  <head>
    <title>Get Reddit User's Last Comment</title>
    <style>
        html {
            --bg-Color: whitesmoke;
            --el-bg-color: white;
            --color: #333;
            --text-shadow: text-shadow: 0 0 1px #999;

            height: 100%;
            overflow: hidden;
        }

        body {
            margin: 0;
            position: relative;
            height: 1080px;
            background-color: var(--bg-color);
            color: var(--color);
            overflow: auto;
        }

        #main-container {
            height: 100%;
        }

        #main-container * {
            box-sizing: border-box;
            display: block;
            margin: 16px auto;
            position: relative;
            padding: 0;
            background-color: var(--bg-color);
            color: var(--color);
            font-size: 20px;
            font-weight: bold;
            text-align: center;

            /*border: 1px solid;*/

            outline: none;
        }

        #main-container #background {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: url("https://www.redditstatic.com/amp/img/snoo8.png");
            opacity: .1;
        }

        /*use this container class to make everything inside it inline-block*/
        #main-container * .inline-b * {
            display: inline-block;
        }

        #main-container * .underline {
            display: inline-block;
            border-bottom: 1px solid #666;
        }

        /* Start Element CSS */

        #main-container h1 {
            display: inline-block;
            margin: 8vw auto 70px;
            color: #333;
            font-size: 40px;
            /*letter-spacing: 1px;*/
            text-shadow: var(--text-shadow);
            transform: scaleX(1.25) scaleY(2.5);
        }

        #main-container header,
        #main-container label {
            text-shadow: var(--text-shadow);
        }

        #main-container label {
            margin-right: 16px;
        }

        #main-container input {
            padding: 8px 16px;
            background-color: var(--el-bg-color);
            font-size: 18px;
            color: #404040;
            border: 1px solid darkgray;
            border-radius: 16px;
            box-shadow: 0 1px 2px #999;
        }

        #main-container button {
            margin: 40px auto 56px;
            padding: 14px 50px;
            background-color: #24a0ed;
            color: white;
            border: none;
            border-radius: 4px;
            box-shadow: 0 1px 2px #444;
            cursor: pointer;
        }
        #main-container button:active {
            transform: translateY(2px);
        }

        #main-container output {
            width: 40vw;
            height: 64px;
            padding: 8px 8px 16px;
            color: #212121;
            font-style: italic;
            letter-spacing: 2px;
            text-shadow: 0 0 1px #999, 0 0 4px white;
            border-radius: 8px;
        }

        #main-container footer {
            position: absolute;
            bottom: -16px;
            width: 100%;
            padding: 20px;
            background-color: #222;
            color: whitesmoke;
            font-size: 14px;
            text-align: center;
        }   
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
</head>

<body>
    <div id="main-container" data-ng-app="app" data-ng-controller="controller">
        <div id="background"></div>
        <section>
            <header class="underline">
                <h1>Get a Reddit User's Latest Comment</h1>
            </header>
            <div class="inline-b">
                <label>Reddit Username: </label>
                <input data-ng-model="username" data-ng-keypress="checkKey($event)" />
            </div>
            <button ng-click="getComment($event)">Get Comment</button>
        </section>
        <section>
            <header class="underline">Latest Comment:</header>
            <output>{{ comment }}</output>
        </section>
        <footer>&copy; Chase Allen 2017</footer>
    </div>
</body>

<script>
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
                    $timeout(() => { username.focus(); }, 300);
                }, 333);
            }, 2000);
        }

        //http request to retrieve data
        s.getComment = ev => {
            if (!s.username) {
                s.comment = `Plese input a username.`;
                $timeout(() => { username.focus(); }, 0);
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
                    s.comment = `Whoops! There was an error. :( Please try again.`;
                    s.tryAnother();
                }
            }

            if (s.comment == "" || s.comment == null || s.comment == undefined) {
                s.comment = `Whoops! There was an error. :( Please try again.`;
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
</script>

</html>
