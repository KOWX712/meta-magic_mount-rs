// Copyright 2025 Magic Mount-rs Authors
// SPDX-License-Identifier: GPL-3.0-or-later

use std::{
    path::Path,
    sync::{LazyLock, Mutex, atomic::AtomicBool},
};

use ksu::TryUmount;

pub static KSU: AtomicBool = AtomicBool::new(false);

pub fn check_ksu() {
    let status = ksu::version().is_some_and(|v| {
        log::info!("KernelSU Version: {v}");
        true
    });

    KSU.store(status, std::sync::atomic::Ordering::Relaxed);
}

static LAST: AtomicBool = AtomicBool::new(false);
pub static LIST: LazyLock<Mutex<TryUmount>> = LazyLock::new(|| Mutex::new(TryUmount::new()));

pub fn send_unmountable<P>(target: P)
where
    P: AsRef<Path>,
{
    if !KSU.load(std::sync::atomic::Ordering::Relaxed) {
        return;
    }

    if LAST.load(std::sync::atomic::Ordering::Relaxed) {
        return;
    }

    LIST.lock().unwrap().add(target);
}
