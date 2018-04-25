window.onload = () => {
    let source = document.querySelector(".cookie");
    source.addEventListener("click", addCookie);
    let scoreBoard = document.querySelector(".info > span");
    let player = new Profil();
    let shop = new Shop(player);
    player.shopping(shop);
    player.refreshInfo();

    function addCookie(){
        player.gain();
        shop.refresh();
    }
};
    
class Shop{
    constructor(p_customer){
        this.customer = p_customer;
        this.options = {};
        this.HTMLElement = document.querySelector('.shop');
        let self = this;
        this.HTMLElement.addEventListener("click", function(){
            self.refresh();
        });
        
        this.options.multiplier = new Option(this, "multiplier", 50);
        this.options.autoClicker = new Option(this, "auto-clicker", 500);
        this.options.boost = new Option(this, "boost", 5000);
    }
    
    refresh(){
        for(let key in this.options){
            let currentOption = this.options[key];
            
            currentOption.check();
        }
    }

    add(p_html_element){
        this.HTMLElement.appendChild(p_html_element);
    }
}

class Option{
    constructor(p_parent, p_name, p_price){
        this.parent = p_parent;
        this.customer = this.parent.customer;

        this.name = p_name;
        this.basePrice = p_price;
        this.currentPrice = this.basePrice;
        this.HTMLElement = null;
        
        this.value = 1;
        this.display = false;
    }
    
    increasePrice(){
        this.currentPrice *= 2;
    }
    
    buy(){
        if(this.customer.currency >= this.currentPrice && !this.HTMLElement.classList.contains("inactive")){
            this.customer.spend(this.currentPrice);
            this.value++;
            if(this.name != "boost"){
                this.increasePrice();
            }

            this.parent.refresh();
            return true;
        }
        else{
            return false;
        }
    }
    
    check(){
        if( !this.display && this.customer.currency >= (this.currentPrice * 0.5) ){
            this.display = true;
        }

        if(this.display){
            if(this.HTMLElement == null){

                this.HTMLElement = document.createElement("div");
                this.HTMLElement.classList.add("button");
                this.HTMLElement.classList.add("inactive");
                this.HTMLElement.classList.add(this.name);
                
                let myself = this;
                this.HTMLElement.addEventListener("click", function(){
                    myself.onClick();
                });

            }

            
            if( this.customer.currency < this.currentPrice ){
                if(!this.HTMLElement.classList.contains("inactive")){
                    this.HTMLElement.classList.add("inactive");
                }
            }
            else if(this.HTMLElement.classList.contains("inactive")){
                this.HTMLElement.classList.remove("inactive");
            }
            
            if(this.name == "boost" && this.customer.boostValue > 1 && !this.HTMLElement.classList.contains("inactive")){
                this.HTMLElement.classList.add("inactive");
            }

            let html = "<p>" + this.getText() + "</p>";
            html += "<span class='price'>" + this.currentPrice + "</span>";
            this.HTMLElement.innerHTML = html;
            this.parent.add(this.HTMLElement);
        }
    }

    onClick(){
        /* Do Something ! */
        if(this.buy()){
            if(this.name == "multiplier"){
                this.customer.multiplier = this.value;
            }
            else if(this.name == "auto-clicker"){
                this.customer.addAutoClick();
            }
            else if(this.name == "boost"){
                this.customer.activeBoost();
            }
        }
    }

    getText(){
        let text = "";

        if(this.name == "multiplier"){
            text = "Get the <strong>x" + (this.value + 1) + " "  + this.name + "</strong>";
        }
        else if(this.name == "auto-clicker"){
            text = "Get an <strong>" + this.name + "</strong>";
        }
        else if(this.name == "boost"){
            text = "Active a temporary <strong>" + this.name + "</strong> !";
        }
        

        return text;
    }
}

class Profil{
    constructor(){
        this.name = "Player";
        this.currency = 0;

        this.multiplier = 1;
        this.autoClicker = 1;
        this.boostValue = 1;

        this.autoClickerInterval = null;
        this.boostActive = false;

        this.stat = document.querySelector(".info");
        this.shop = null;

        this.readCookie();
    }

    gain(p_amount = 1){
        this.currency += p_amount * this.multiplier * this.boostValue;
        this.refreshInfo();

        this.saveCookie();
    }
    
    spend(p_amount){
        this.currency -= p_amount;
        this.refreshInfo();
    }

    refreshInfo(){
        this.stat.innerHTML = "<p><strong>";
        this.stat.innerHTML += + this.currency + " cookies</strong></p>";

        if(this.boostValue > 1){
            this.stat.innerHTML += "<p>(bonus " + (this.boostValue * 100) + "%)</p>";
        }

        if(this.shop != null){
            this.shop.refresh();
        }
    }


    addAutoClick(){
        if(this.autoClickerInterval == null){
            let self = this;
            this.autoClickerInterval = window.setInterval( 
                function(){
                    // let source = document.querySelector(".cookie");
                    // source.dispatchEvent("click")
                    self.gain(self.autoClicker);
                }, 
                1 * 1000
            );
        }
        else{
            this.autoClicker++;
        }
    }

    shopping(p_shop){
        this.shop = p_shop;
    }

    activeBoost(){
        let self = this;
        this.boostValue = 3;
        this.refreshInfo();

        if(this.boostActive == false){
            this.boostActive = true;
            window.setTimeout(function(){
                self.boostValue = 1;
                self.refreshInfo();
                self.boostActive = false;
            }, 30 * 1000);
        }
    }

    saveCookie(){
        let date = new Date();
        date.setTime( date.getTime() + ( 7 * 60 * 60 * 24 * 1000 ));

        let newCookie = "cookie=" + this.currency + "; ";
        newCookie += "expire=" + date.toUTCString() + "; ";
        newCookie += "path=/";
        document.cookie = newCookie;
        
        newCookie = "multiplier=" + this.shop.options.multiplier.value + "; ";
        newCookie += "expire=" + date.toUTCString() + "; ";
        newCookie += "path=/";
        document.cookie = newCookie;

        newCookie = "autoclicker=" + this.shop.options.autoClicker.value + "; ";
        newCookie += "expire=" + date.toUTCString() + "; ";
        newCookie += "path=/";
        document.cookie = newCookie;
    }

    readCookie(){
        let cookieData = document.cookie;
        cookieData = cookieData.split(";");
        console.log(cookieData);
    }
}


function reset(){
    document.cookie = "";
    console.log("No more cookie for you :'( ");
}