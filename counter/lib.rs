#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod counter {
    #[ink(storage)]
    pub struct Counter {
        value: i32, // The number we store (can be positive or negative)
    }

    impl Counter {
        /// Constructor: set the starting value
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            Self { value: init_value }
        }

        /// Default constructor: start at 0
        #[ink(constructor)]
        pub fn default() -> Self {
            Self { value: 0 }
        }

        /// Increase the counter by 1
        #[ink(message)]
        #[allow(clippy::arithmetic_side_effects)]
        pub fn increment(&mut self) {
            self.value += 1;
        }

        /// Decrease the counter by 1
        #[ink(message)]
        #[allow(clippy::arithmetic_side_effects)]
        pub fn decrement(&mut self) {
            self.value -= 1;
        }

        /// Get the current value
        #[ink(message)]
        pub fn get(&self) -> i32 {
            self.value
        }
    }
}
