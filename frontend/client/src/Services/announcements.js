import api from "./api";

// FUNCTIONS

const parseDate = obj => ({ ...obj, date: new Date(obj.date) });

/**
 * Retrieves all of a company's announcements from the database
 * @param {number} companyId
 * @returns {AnnouncementResponse[]} An array of all non-deleted announcements for the given company
 */
export const getAnnouncements = async companyId => {
  const response = await api.get(`/company/${companyId}/announcements`);
  return response.data.map(parseDate);
};

/**
 * Creates a new announcement in the database
 * @param {AnnouncementRequest} requestObj
 * @returns {AnnouncementResponse} The created announcement with ID, author info
 */
export const createAnnouncement = async requestObj => {
  const response = await api.post(
    `/announcements/${requestObj.companyId}`,
    requestObj
  );
  return parseDate(response.data);
};

/**
 * Sets an announcement as deleted in the database
 * @param {number} id - The ID of the announcement
 * @param {Credentials} credentialsObj - User credentials
 * @returns {AnnouncementResponse} The deleted announcement
 */
export const deleteAnnouncement = async (id, credentialsObj) => {
  const response = await api.delete(`/announcements/${id}`, {
    data: credentialsObj
  });
  return parseDate(response.data);
};

/**
 * Updates the values of an announcement in the database
 * @param {number} id
 * @param {AnnouncementRequest} requestObj
 * @returns The updated announcement
 */
export const editAnnouncement = async (id, requestObj) => {
  const response = await api.patch(`/announcements/${id}`, requestObj);
  return parseDate(response.data);
};

// TYPE DEFINITIONS

/**
 * @typedef {Object} AnnouncementRequest
 * @property {Credentials} credentials - User credentials
 * @property {string} title - The title of the announcement
 * @property {string} message - The message of the announcement
 * @property {number} companyId - The ID of the selected company at announcement creation time
 */

/**
 * @typedef {Object} AnnouncementResponse
 * @property {number} id - Announcement ID generated by the database
 * @property {Date} date - Creation date of the announcement
 * @property {string} title - The title of the announcement
 * @property {string} message - The message of the announcement
 * @property {Object} author - The user who created the announcement
 */

/**
 * @typedef {Object} Credentials
 * @property {string} username
 * @property {string} password
 */