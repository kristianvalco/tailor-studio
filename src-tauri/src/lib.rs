// Tauri application entry point. Keeps Rust thin — the app is frontend-driven;
// native file/clipboard access is provided by the dialog & fs plugins.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running Tailor Studio");
}
