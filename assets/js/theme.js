/*
 * OORSSS: Object oriented really simple stylesheet switcher
 *
 * This script will generate buttons to switch stylesheets.
 * It will use localstorage to store the users choice between sessions.
 *
 * STEP 1
 * ======
 * To get started you need to create a new themePicker, providing:
 *      - the id of the element within which the picker will be created [Required]
 *      - provide the path to the stylesheets [optional]
 * 
 * eg
 *      let themeSwitch = new themePicker("themeSwitch","/assets/css/");
 *
 * STEP 2
 * ======
 * Add the themes you wish to make available to the theme picker, providing:
 *      - the theme name (will be stored in localstorage) [Required]
 *      - the theme's css file [Required]
 *      - whether this is the site's default theme [optional, default false]
 * 
 * eg
 *      themeSwitch.addTheme(new theme("Default","default.css",true));
 * 
 * STEP 3
 * ======
 * Instantiate the picker:
 *      themeSwitch.createPicker();
 * 
 * This will create:
 *      - the HTML buttons within the defined HTML element
 *      - the non default stylesheet links with rel "alternate stylesheet"
 * 
 * Note:  The system assumes the default stylesheet already exists.
 *        This ensures the site will render in the default styles
 *        without JavaScript.
 *
*/

class theme {
    constructor(name, css, dflt = false) {
        this.name = name;
        this.css = css;
        this.dflt = dflt;
    }
    createButton(){
        /*Create the button element*/
        const btn = document.createElement("button");
        btn.setAttribute('type','button');
        btn.setAttribute('onclick',"themeSwitch.setTheme('" + this.name + "')");
        btn.appendChild(document.createTextNode(this.name));
        return btn;
    }
    createOption(){
        /*Create the button element*/
        const opt = document.createElement("option");
        opt.setAttribute('value',this.name);
        opt.appendChild(document.createTextNode(this.name));
        return opt;
    }
    createCssLink(){
        /*Create the link element*/
        const lnk = document.createElement("link");
        lnk.setAttribute('rel','alternate stylesheet');
        lnk.setAttribute('href',this.css);
        lnk.setAttribute('media','all');
        return lnk;
    }
}

class themePicker {
    #CSS_NAKED_THEME = "Naked"; //Also used for css file, lowercase. eg "Naked" => naked.css
    #CSS_NAKED_DAY_OF_MONTH = 9;
    #CSS_NAKED_MONTH = 3; //3 = April

    #DROPDOWN_THEME_MIN = 4;
    #themes = [];
    #cssFiles = [];
    defaultTheme;
    currentTheme;
    constructor(id, path, text = "", forceNakedDay = false, msgNakedDay, enableRandom){
        this.id = id;
        this.path = path;
        this.text = text;
        this.enableRandom = enableRandom;
        const today = new Date();
        if (forceNakedDay && (today.getMonth() == this.#CSS_NAKED_MONTH && today.getDate() == this.#CSS_NAKED_DAY_OF_MONTH)) { 
            this.forceNakedDay = forceNakedDay;
        }
        if (msgNakedDay === "") {
            // use default message
            this.msg = "Today is April 9th, CSS Naked Day. On this day many web developers turn off the styling on their sites to raise awareness for standards based web development. Without web standards the web would not be what it is today."

        }
        else if (msgNakedDay != null) {
            // Use specified message
            this.msg = msgNakedDay;
        }
    }

    addNakedTheme() {
        themeSwitch.addTheme(new theme(this.#CSS_NAKED_THEME, this.#CSS_NAKED_THEME.toLocaleLowerCase() + ".css"));
    }

    addTheme(theme) {
        this.#cssFiles.push(theme.css);
        theme.css = this.path + theme.css;
        if(theme.dflt){
            /* Default theme is also current theme unless set later */
            this.defaultTheme = this.currentTheme = theme;
        }

        if(theme.name == localStorage.getItem('theme')) {
            this.currentTheme = theme;
        }
        this.#themes.push(theme);
    }

    setTheme(themeName){
        const styles = document.querySelectorAll('link[rel~="stylesheet"]');
        /* set current theme */
        for(let i=0; i<this.#themes.length; i++){
            if(this.#themes[i].name == themeName) {
                this.currentTheme = this.#themes[i];
                break;
            }
        }

        // if current theme is random.css 
        // override current CSS with a randomly chosen CSS file 
        let currentCss = this.currentTheme.css;
        if(currentCss.endsWith("random.css")) {
            //determine random css file
            let rndId = Math.floor(Math.random() * this.#themes.length);
            //alert(rndId);
            currentCss = this.#themes[rndId].css;
        }
        
        /* insert correct rel attribute (alternate for inactive styles)  */
        for (let i = 0; i < styles.length; ++i) {   
            /* returns true if the href contains any of the strings in the themes array */
            /* this if statement ensures we only alter stylesheets used by the themes*/
            if(this.#cssFiles.some(v => styles[i].href.includes(v))) {
                if(styles[i].href.endsWith(currentCss)) {
                    styles[i].rel = "stylesheet";
                }
                else {
                    styles[i].rel = "alternate stylesheet";
                }
            }

            //if naked style, remove all fixed stylesheets by setting them to alternate
            //otherwise, make sure they added by removing the alternate setting
            if(styles[i].href.endsWith("fonts.css") ||
                styles[i].href.endsWith("structure.css") ||
                styles[i].href.endsWith("style.css")) {
                if(themeName == this.#CSS_NAKED_THEME || this.forceNakedDay) {
                    styles[i].rel = "alternate stylesheet";
                }
                else {
                    styles[i].rel = "stylesheet";
                }                    
            }
        }
    
        if(this.#themes.length < this.#DROPDOWN_THEME_MIN) {
            /* Disable the button for the currently selected style */
            const btns = document.getElementById(this.id).querySelectorAll('button');
            for (let i = 0; i < btns.length; ++i) {
                if(btns[i].onclick.toString().includes(this.currentTheme.name)) {
                    btns[i].setAttribute("disabled","");
                }
                else {
                    btns[i].removeAttribute("disabled");
                }
            }
        }
        else {
            /* Select the option for there current theme */
            const btns = document.getElementById(this.id).querySelectorAll('option');
            for (let i = 0; i < btns.length; ++i) {
                if(btns[i].value.toString().includes(this.currentTheme.name)) {
                    btns[i].setAttribute("selected","");
                }
                else {
                    btns[i].removeAttribute("selected");
                }
            }

        }

        if (!this.forceNakedDay) { //don't store theme if forced
            localStorage.setItem("theme",this.currentTheme.name);
        }
    }    

    toggleButtonState(btnName, disabled = false) {
        const btn = document.querySelector('button[onclick*="' + btnName + '"]');
        if(btn) {
            btn.setAttribute("disabled","");
        }
    }

    createPicker(){
        const dfltLink = document.querySelector('link[href*="' + this.defaultTheme.css + '"]');

        if (this.forceNakedDay) {
            this.setTheme(this.#CSS_NAKED_THEME);
            
            const h1 = document.createElement("h1");
            h1.appendChild(document.createTextNode("CSS Naked Day"));
            const spn = document.createElement("span");
            spn.setAttribute("id","styleLabel")
            spn.appendChild(document.createTextNode(this.msg));

            document.getElementById(this.id).appendChild(h1);
            document.getElementById(this.id).appendChild(spn);
        }
        else {
            //add the random option to the drop down with any one of the available css files.
            if(this.enableRandom) {
                this.addTheme(new theme("Random","random.css"));
            }

            if(this.text.length > 0) {
                const spn = document.createElement("span");
                spn.setAttribute("id","styleLabel")
                spn.appendChild(document.createTextNode(this.text));
                document.getElementById(this.id).appendChild(spn);
            }
    
            
            var choices = document.getElementById(this.id);
            if(this.#themes.length >= this.#DROPDOWN_THEME_MIN) {
                choices = document.createElement("select");
                choices.setAttribute("name","chosen_style");
                choices.setAttribute("aria-labelledBy","styleLabel");
                choices.setAttribute("onchange","themeSwitch.setTheme(this.value);");

                const frm = document.createElement("form");
                frm.setAttribute("name","styler");
                frm.appendChild(choices);
                document.getElementById(this.id).appendChild(frm);
            }

            for(let i=0; i<this.#themes.length; i++){
                /* Add all buttons into the HTML element with the theme id */
                if(this.#themes.length < this.#DROPDOWN_THEME_MIN) {
                    //create buttons
                    choices.appendChild(this.#themes[i].createButton());
                }
                else {
                    //create dropdown
                    choices.appendChild(this.#themes[i].createOption());
                }
    
                /* Create all the HTML links, except for the default one */
                if(this.defaultTheme.css != this.#themes[i].css) {
                    const lnk = document.createElement("link");
                    lnk.setAttribute('rel','alternate stylesheet');
                    lnk.setAttribute('href',this.#themes[i].css);
                    lnk.setAttribute('media','all');
                    dfltLink.after(lnk);
                }
            }
            if(localStorage.getItem('theme') === null) {
                this.toggleButtonState(this.defaultTheme.name, true);
            }
            else {
                this.setTheme(localStorage.getItem('theme'));
            }    
        }
    }
}
let themeSwitch = new themePicker("themeSwitch","/assets/css/","Choose a style:", true, "", true);
themeSwitch.addTheme(new theme("Default","default.css",true));
themeSwitch.addTheme(new theme("Grey","olden.css"));
themeSwitch.addTheme(new theme("High Contrast","high.css"));
themeSwitch.addTheme(new theme("Matrix","matrix.css"));
themeSwitch.addTheme(new theme("Miami","miami.css"));
themeSwitch.addTheme(new theme("Plain","plain.css"));
themeSwitch.addTheme(new theme("Sidebar","sidebar.css"));
themeSwitch.addNakedTheme();

themeSwitch.createPicker();
