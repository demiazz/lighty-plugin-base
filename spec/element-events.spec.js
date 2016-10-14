import application from 'lighty';

import { fixture, clear } from './helpers';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
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

      eventSpy = sinon.spy();

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

      expect(eventSpy.callCount).toEqual(0);

      children.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      children.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it('adds support for `<event>[, <event>] on <selector>`', () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      children.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      children.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a children matched by selector is event's target", () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      children.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      children.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a child of children matched by the selector is event's target", () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      subchildren.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      subchildren.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it("doesn't call handler when children which don't match by the selector is event's target", () => {
      application.component('.elements-events', {
        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      otherChildren.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(0);

      otherChildren.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(0);
    });

    it('calls handler on a component instance', () => {
      let component;

      application.component('.elements-events', {
        init() {
          component = this;
        },

        'click, custom-event on .children': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);
      expect(component).toBeTruthy();

      children.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).calledOn(component)).toBe(true);

      children.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).calledOn(component)).toBe(true);
    });

    it('passes an event to a handler', () => {
      application.component('.elements-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      children.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).args[0] instanceof Event).toBe(true);

      children.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).args[0] instanceof Event).toBe(true);
    });
  });
});
