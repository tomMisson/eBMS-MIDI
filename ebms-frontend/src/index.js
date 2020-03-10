import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

(function() {
    /*document.addEventListener("DOMContentLoaded", initialiseWebPage);
    function initialiseWebPage() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            element.firstChild.addEventListener('click', function(e) {
                pageLinks.forEach(element => {
                    element.firstChild.classList.remove("navLinkActive");
                    element.firstChild.classList.add("navLinkInactive");
                });
                if(e.target.parentElement.tagName === "A") {
                    e.target.parentElement.classList.remove("navLinkInactive");
                    e.target.parentElement.classList.add("navLinkActive");
                }
                else if (e.target.tagName === "A") {
                    e.target.classList.remove("navLinkInactive");
                    e.target.classList.add("navLinkActive");
                }
                else {
                    e.preventDefault();
                }
            });
        });
    }*/
})();