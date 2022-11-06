use std::fs::{self};
use std::path::Path;

use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};

const DATA_FOLDER: &str = "data/";

pub fn save(content: &str) -> String {
    let code = gen();
    fs::write(get_path(&code), &content).expect("Unable to write file");
    code
}

pub fn read(code: &str) -> String {
    let data = fs::read_to_string(get_path(&code)).expect("Unable to read file");
    data
}

fn gen() -> String {
    let mut code = gen_string();

    while Path::new(&code).exists() {
        code = gen_string();
    }

    code
}

fn gen_string() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(4)
        .map(char::from)
        .collect()
}

fn get_path(code: &str) -> String {
    DATA_FOLDER.to_owned() + code
}
