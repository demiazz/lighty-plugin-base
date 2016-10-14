import application from 'lighty';

import { fixture, clear, matchers } from './helpers';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
  });

  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  describe('elements events', () => {
    let eventSpy;
    let clickEvent;
    let customEvent;
    let node;
    let children;
    let subchildren;
    let otherChildren;

    beforeEach(() => {
      fixture(`
        <div class="elements-events">
          <div class="other-children"></div>
          <div class="children">
            <div class="subchildren"></div>
          </div>
        </div>
      `);

      eventSpy = jasmine.createSpy('event');

      clickEvent = document.createEvent('HTMLEvents');
      clickEvent.initEvent('click', true, true);

      customEvent = document.createEvent('CustomEvent');
      customEvent.initEvent('custom-event', true, true);

      node = document.querySelector('.elements-events');
      children = node.querySelector('.children');
      subchildren = children.querySelector('.subchildren');
      otherChildren = node.querySelector('.other-children');
    });

    afterEach(clear);

    it('adds support for `<event> on <selector>` pattern', () => {
      application.component('.elements-events', {
        'click on .children': eventSpy,
        'custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      children.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      children.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[, <event>] on <selector>`', () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      children.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      children.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler when a children matched by selector is event's target", () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      children.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      children.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler when a child of children matched by the selector is event's target", () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      subchildren.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      subchildren.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("doesn't call handler when children which don't match by the selector is event's target", () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      otherChildren.dispatchEvent(clickEvent);
      expect(eventSpy).not.toHaveBeenCalled();

      otherChildren.dispatchEvent(customEvent);
      expect(eventSpy).not.toHaveBeenCalled();
    });

    it('calls handler on a component instance', () => {
      let component;

      application.component('.elements-events', {
        init() {
          component = this;
        },

        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      children.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      children.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);

      expect(eventSpy).toHaveBeenCalledOn(component);
    });

    it('passes an event to a handler', () => {
      application.component('.elements-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      children.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0)[0]).toBeInstanceOf(Event);

      children.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(eventSpy.calls.argsFor(1)[0]).toBeInstanceOf(Event);
    });
  });
});
