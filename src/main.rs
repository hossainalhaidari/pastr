mod db;

use rocket::response::Redirect;
use url::Url;

#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hi!"
}

#[get("/<code>")]
fn redirect(code: &str) -> Redirect {
    let content = db::read(&code);

    let parsed = Url::parse(&content);

    if parsed.is_err() {
        return Redirect::to(format!("/v/{}", code));
    }

    Redirect::to(content)
}

#[get("/v/<code>")]
fn view(code: &str) -> String {
    let content = db::read(&code);
    format!("{}", content)
}

#[get("/s/<content>")]
fn shorten(content: &str) -> String {
    let code = db::save(content);
    format!("{}", code)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .mount("/", routes![shorten])
        .mount("/", routes![view])
        .mount("/", routes![redirect])
}
