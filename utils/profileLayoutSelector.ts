import { Donor } from '../types';

/**
 * Selective rollout logic for Test3 profile layout
 * 
 * This utility determines which donors should see the enhanced Test3 profile layout
 * vs the standard production profile layout.
 * 
 * Phase 1: Limited rollout to 4 specific users for testing and feedback
 * Future phases can expand this list or use different criteria
 */

// Users selected for Test3 profile layout rollout
const TEST3_ROLLOUT_USERS = [
  'Jeff Wernsing',
  'Sofia Borden', 
  'Jack Simms',
  'Rachel Gideon' // Note: Originally requested "Rachel Bryant" but profile is "Rachel Gideon"
];

/**
 * Determines if a donor should use the Test3 enhanced profile layout
 * @param donor - The donor object to check
 * @returns boolean - true if should use Test3 layout, false for standard layout
 */
export const useTest3Layout = (donor: Donor): boolean => {
  return TEST3_ROLLOUT_USERS.includes(donor.name);
};

/**
 * Get the list of users currently in the Test3 rollout
 * @returns string[] - Array of donor names using Test3 layout
 */
export const getTest3RolloutUsers = (): string[] => {
  return [...TEST3_ROLLOUT_USERS];
};

/**
 * Add a user to the Test3 rollout (for future expansion)
 * @param donorName - Name of donor to add to rollout
 */
export const addToTest3Rollout = (donorName: string): void => {
  if (!TEST3_ROLLOUT_USERS.includes(donorName)) {
    TEST3_ROLLOUT_USERS.push(donorName);
  }
};

/**
 * Remove a user from the Test3 rollout
 * @param donorName - Name of donor to remove from rollout
 */
export const removeFromTest3Rollout = (donorName: string): void => {
  const index = TEST3_ROLLOUT_USERS.indexOf(donorName);
  if (index > -1) {
    TEST3_ROLLOUT_USERS.splice(index, 1);
  }
};
