"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.onload = function () {
    var source = document.querySelector(".cookie");
    source.addEventListener("click", addCookie);
    var scoreBoard = document.querySelector(".info > span");
    var player = new Profil();
    var shop = new Shop(player);
    player.shopping(shop);
    player.refreshInfo();

    function addCookie() {
        player.gain();
        shop.refresh();
    }
};

var Shop = function () {
    function Shop(p_customer) {
        _classCallCheck(this, Shop);

        this.customer = p_customer;
        this.options = {};
        this.HTMLElement = document.querySelector('.shop');
        var self = this;
        this.HTMLElement.addEventListener("click", function () {
            self.refresh();
        });

        this.options.multiplier = new Option(this, "multiplier", 50);
        this.options.autoClicker = new Option(this, "auto-clicker", 500);
        this.options.boost = new Option(this, "boost", 5000);
    }

    _createClass(Shop, [{
        key: "refresh",
        value: function refresh() {
            for (var key in this.options) {
                var currentOption = this.options[key];

                currentOption.check();
            }
        }
    }, {
        key: "add",
        value: function add(p_html_element) {
            this.HTMLElement.appendChild(p_html_element);
        }
    }]);

    return Shop;
}();

var Option = function () {
    function Option(p_parent, p_name, p_price) {
        _classCallCheck(this, Option);

        this.parent = p_parent;
        this.customer = this.parent.customer;

        this.name = p_name;
        this.basePrice = p_price;
        this.currentPrice = this.basePrice;
        this.HTMLElement = null;

        this.value = 1;
        this.display = false;
    }

    _createClass(Option, [{
        key: "increasePrice",
        value: function increasePrice() {
            this.currentPrice *= 2;
        }
    }, {
        key: "buy",
        value: function buy() {
            if (this.customer.currency >= this.currentPrice && !this.HTMLElement.classList.contains("inactive")) {
                this.customer.spend(this.currentPrice);
                this.value++;
                if (this.name != "boost") {
                    this.increasePrice();
                }

                this.parent.refresh();
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: "check",
        value: function check() {
            if (!this.display && (this.customer.currency >= this.currentPrice * 0.5 || this.value > 1)) {
                this.display = true;
            }

            if (this.display) {
                if (this.HTMLElement == null) {

                    this.HTMLElement = document.createElement("div");
                    this.HTMLElement.classList.add("button");
                    this.HTMLElement.classList.add("inactive");
                    this.HTMLElement.classList.add(this.name);

                    var myself = this;
                    this.HTMLElement.addEventListener("click", function () {
                        myself.onClick();
                    });
                }

                if (this.customer.currency < this.currentPrice) {
                    if (!this.HTMLElement.classList.contains("inactive")) {
                        this.HTMLElement.classList.add("inactive");
                    }
                } else if (this.HTMLElement.classList.contains("inactive")) {
                    this.HTMLElement.classList.remove("inactive");
                }

                if (this.name == "boost" && this.customer.boostValue > 1 && !this.HTMLElement.classList.contains("inactive")) {
                    this.HTMLElement.classList.add("inactive");
                }

                var html = "<p>" + this.getText() + "</p>";
                html += "<span class='price'>" + this.currentPrice + "</span>";
                this.HTMLElement.innerHTML = html;
                this.parent.add(this.HTMLElement);
            }
        }
    }, {
        key: "onClick",
        value: function onClick() {
            /* Do Something ! */
            if (this.buy()) {
                if (this.name == "multiplier") {
                    this.customer.multiplier = this.value;
                } else if (this.name == "auto-clicker") {
                    this.customer.addAutoClick();
                } else if (this.name == "boost") {
                    this.customer.activeBoost();
                }
            }
        }
    }, {
        key: "getText",
        value: function getText() {
            var text = "";

            if (this.name == "multiplier") {
                text = "Get the <strong>x" + (this.value + 1) + " " + this.name + "</strong>";
            } else if (this.name == "auto-clicker") {
                text = "Get an <strong>" + this.name + "</strong>";
            } else if (this.name == "boost") {
                text = "Active a temporary <strong>" + this.name + "</strong> !";
            }

            return text;
        }
    }, {
        key: "adjustPrice",
        value: function adjustPrice(p_count) {
            while (p_count > 0) {
                this.increasePrice();
                p_count--;
            }
        }
    }]);

    return Option;
}();

var Profil = function () {
    function Profil() {
        _classCallCheck(this, Profil);

        this.name = "Player";
        this.currency = 0;

        this.multiplier = 1;
        this.autoClicker = 1;
        this.boostValue = 1;

        this.autoClickerInterval = null;
        this.boostActive = false;

        this.stat = document.querySelector(".info");
        this.shop = null;
    }

    _createClass(Profil, [{
        key: "gain",
        value: function gain() {
            var p_amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.currency += p_amount * this.multiplier * this.boostValue;
            this.refreshInfo();

            this.saveCookie();
        }
    }, {
        key: "spend",
        value: function spend(p_amount) {
            this.currency -= p_amount;
            this.refreshInfo();
        }
    }, {
        key: "refreshInfo",
        value: function refreshInfo() {
            this.stat.innerHTML = "<p><strong>";
            this.stat.innerHTML += +this.currency + " cookies</strong></p>";

            if (this.boostValue > 1) {
                this.stat.innerHTML += "<p>(bonus " + this.boostValue * 100 + "%)</p>";
            }

            if (this.shop != null) {
                this.shop.refresh();
            }
        }
    }, {
        key: "addAutoClick",
        value: function addAutoClick() {
            if (this.autoClickerInterval == null) {
                var self = this;
                this.autoClickerInterval = window.setInterval(function () {
                    self.gain(self.autoClicker);
                }, 1 * 1000);
            } else {
                this.autoClicker++;
            }
        }
    }, {
        key: "shopping",
        value: function shopping(p_shop) {
            this.shop = p_shop;
            this.readCookie();
        }
    }, {
        key: "activeBoost",
        value: function activeBoost() {
            var p_boost_value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

            var self = this;
            this.boostValue = p_boost_value;
            this.refreshInfo();

            if (this.boostActive == false) {
                this.boostActive = true;
                window.setTimeout(function () {
                    self.boostValue = 1;
                    self.refreshInfo();
                    self.boostActive = false;
                }, 30 * 1000);
            }
        }
    }, {
        key: "saveCookie",
        value: function saveCookie() {
            var date = new Date();
            date.setTime(date.getTime() + 7 * 60 * 60 * 24 * 1000);

            var newCookie = "cookie=" + this.currency + "; ";
            newCookie += "expire=" + date.toUTCString() + "; ";
            newCookie += "path=/";
            document.cookie = newCookie;

            newCookie = "multiplier=" + this.shop.options.multiplier.value + "; ";
            newCookie += "expire=" + date.toUTCString() + "; ";
            newCookie += "path=/";
            document.cookie = newCookie;

            newCookie = "autoClicker=" + this.shop.options.autoClicker.value + "; ";
            newCookie += "expire=" + date.toUTCString() + "; ";
            newCookie += "path=/";
            document.cookie = newCookie;
        }
    }, {
        key: "readCookie",
        value: function readCookie() {
            // let cookieData;
            var cookieData = {
                cookie: 0,
                multiplier: 1,
                autoClicker: 0
            };
            var cookieRawData = document.cookie;
            cookieRawData = cookieRawData.split(";");

            for (var i = 0; i < cookieRawData.length; i++) {
                var line = cookieRawData[i];
                line = line.trim();
                line = line.split("=");

                console.log(line);
                cookieData[line[0]] = parseInt(line[1]);
            }
            console.log(cookieData);

            this.currency = cookieData.cookie;

            this.multiplier = cookieData.multiplier;
            this.shop.options.multiplier.value = cookieData.multiplier;
            this.shop.options.multiplier.adjustPrice(cookieData.multiplier - 1);

            if (this.autoClicker > 0) {
                this.autoClicker = cookieData.autoClicker;
                this.shop.options.autoClicker.value = cookieData.autoClicker;
                this.shop.options.autoClicker.adjustPrice(cookieData.autoClicker);
                this.addAutoClick();
            }
        }
    }]);

    return Profil;
}();

function reset() {
    var date = new Date();
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24);

    var newCookie = "cookie=0; ";
    newCookie += "expire=" + date.toUTCString() + "; ";
    newCookie += "path=/";
    document.cookie = newCookie;

    newCookie = "multiplier=1; ";
    newCookie += "expire=" + date.toUTCString() + "; ";
    newCookie += "path=/";
    document.cookie = newCookie;

    newCookie = "autoClicker=0; ";
    newCookie += "expire=" + date.toUTCString() + "; ";
    newCookie += "path=/";
    document.cookie = newCookie;

    console.log("No more cookie for you :'( ");
}