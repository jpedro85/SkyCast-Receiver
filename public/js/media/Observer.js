/**
 * Defines a basic Observer for an observer pattern implementation.
 * Classes that extend Observer should implement the update method to react to subject notifications.
 * This is a class because the lack of capabilitie to implement interfaces in javascript
 */
class Observer {

    /**
     * Placeholder for the update method. This should be overridden by subclasses to handle notifications.
     * @param {Object} subject - The reference for the subject object
     * @param {any} event - The event that going to be used for the obsever
     */
    update(subject, event){}
}

export default Observer;
