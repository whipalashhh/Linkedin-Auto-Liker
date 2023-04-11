const puppeteer = require('puppeteer');

// can use supabase session cookie. 
// Created new linkedin account for testing
process.env.LINKEDIN_USERNAME = "1503palash@gmail.com";
const USERNAME = process.env.LINKEDIN_USERNAME ;
if(!USERNAME) {
  console.error("Missing username")
  process.exit(1);
}


process.env.LINKEDIN_PASSWORD = "Palashpalash@123";  
const PASSWORD = process.env.LINKEDIN_PASSWORD;
if(!PASSWORD){
  console.error("Missing PASSWORDs")
  process.exit(1);
}

// all url's of the posts to like
process.env.ALL_POST_URL = "https://www.linkedin.com/posts/google_scholarship-season-is-almost-here-our-partner-activity-7051219860227252224-XJr8?utm_source=share&utm_medium=member_desktop";
const ALL_POST_URL = process.env.ALL_POST_URL;
if(!ALL_POST_URL){
  console.error("Missing ALL_POST_URL")
  process.exit(1);
}

// The company name to like
process.env.COMPANY_NAME = "Google";
const COMPANY_NAME = process.env.COMPANY_NAME;
if(!COMPANY_NAME){
  console.error("Missing COMPANY_NAME")
  process.exit(1);
}

// The interval of time where the function will be executed (like one time each TIME_INTERVAL)
process.env.TIME_INTERVAL = 60000;
const TIME_INTERVAL = Number.parseInt(process.env.TIME_INTERVAL);

/**
 * Login into linkedin
 * Goes in the posts page
 * Like posts of the page
 * Close the windows
 */

//Using {headless:false} for test
const autoLiker = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 720,
  });

  await page.goto('https://www.linkedin.com/checkpoint/rm/sign-in-another-account?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')
  await page.waitForSelector('input[name="session_key"]', {timeout: 60000});
  await page.type('input[name="session_key"]', USERNAME);
  await page.type('input[name="session_password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({waitUntil: "networkidle2"});

  await page.goto(ALL_POST_URL, {waitUntil: "networkidle2"})
  try {
    await page.click(`button[aria-label="Aimer le post de ${COMPANY_NAME}"]`);
    console.log("New post liked")
  } catch(err) {
    console.log("No new post")
  }

  await browser.close();
}


// Auto like every 15 minutes
console.log("Auto liker started");
// Execute the function a first time
autoLiker();
// Execute the function in the given interval
// TODO: improve, do not use interval but a "chain" of setTimeout
setInterval(autoLiker, TIME_INTERVAL * 1000);