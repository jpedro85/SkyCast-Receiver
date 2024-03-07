/**
 * Defines a basic Subject for an observer pattern implementation.
 * Allows observers to subscribe or unsubscribe to notifications, and notifies them of events.
 * This is a class because the lack of capabilitie to implement interfaces in javascript
 */
class Subject {

    /**
     * Adds an observer to the list of observers.
     * @param {Observer} observer - The observer to add.
     */
    addObserver(observer) { };

    /**
     * Removes an observer from the list of observers.
     * @param {Observer} observer - The observer to remove.
     */
    removeObserver(observer) { };

    /**
     * Notifies all subscribed observers of an event.
     * @param {Subject} subject - The subject instance triggering the notification.
     * @param {string} event - The event that occurred.
     */
    notifyObserver(subject, event) { };
}

export default Subject;
