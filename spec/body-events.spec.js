import application from 'lighty';

import { fixture, clear } from './fixtures';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
  });

  afterEach(clear);

  describe('body events', () => {
    it('adds support for `<event> on body` pattern', () => {
      fixture('<div class="body-events"></div>');

      const eventSpy = sinon.spy();

      application.component('.body-events', {
        'click on body': eventSpy,
        'custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      document.body.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      document.body.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
    });

    it('adds support for `<event>[, <event>] on body` pattern', () => {
      fixture('<div class="multiple-body-events"></div>');

      const eventSpy = sinon.spy();

      application.component('.multiple-body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      document.body.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      document.body.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a body is event's target", () => {
      fixture('<div class="body-events-on-body"></div>');

      const eventSpy = sinon.spy();

      application.component('.body-events-on-body', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      document.body.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      document.body.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a component nodes is event's target", () => {
      fixture(`
        <div class="body-events-on-component">
          <div class="inside"></div>
        </div>
       `);

      const eventSpy = sinon.spy();

      application.component('.body-events-on-component', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      const node = document.querySelector('.body-events-on-component');
      const children = node.querySelector('.inside');

      expect(eventSpy.callCount).toEqual(0);

      const clickOnNode = document.createEvent('HTMLEvents');

      clickOnNode.initEvent('click', true, true);

      node.dispatchEvent(clickOnNode);

      expect(eventSpy.callCount).toEqual(1);

      const clickOnChildren = document.createEvent('HTMLEvents');

      clickOnChildren.initEvent('click', true, true);

      children.dispatchEvent(clickOnChildren);

      expect(eventSpy.callCount).toEqual(2);

      const customEventOnNode = new Event('CustomEvent');

      customEventOnNode.initEvent('custom-event', true, true);

      node.dispatchEvent(customEventOnNode);

      expect(eventSpy.callCount).toEqual(3);

      const customEventOnChildren = new Event('CustomEvent');

      customEventOnChildren.initEvent('custom-event', true, true);

      children.dispatchEvent(customEventOnChildren);

      expect(eventSpy.callCount).toEqual(4);
    });

    it("calls handler when a not component nodes is event's target", () => {
      fixture(`
        <div class="sibling"></div>
        <div class="parent">
          <div class="body-events-outside-component"></div>
        </div>
      `);

      const eventSpy = sinon.spy();

      application.component('.body-events-outside-component', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      const sibling = document.querySelector('.sibling');
      const parent = document.querySelector('.parent');

      expect(eventSpy.callCount).toEqual(0);

      const clickOnSibling = document.createEvent('HTMLEvents');

      clickOnSibling.initEvent('click', true, true);

      sibling.dispatchEvent(clickOnSibling);

      expect(eventSpy.callCount).toEqual(1);

      const clickOnParent = document.createEvent('HTMLEvents');

      clickOnParent.initEvent('click', true, true);

      parent.dispatchEvent(clickOnParent);

      expect(eventSpy.callCount).toEqual(2);

      const customEventOnSibling = new Event('CustomEvent');

      customEventOnSibling.initEvent('custom-event', true, true);

      sibling.dispatchEvent(customEventOnSibling);

      expect(eventSpy.callCount).toEqual(3);

      const customEventOnParent = new Event('CustomEvent');

      customEventOnParent.initEvent('custom-event', true, true);

      parent.dispatchEvent(customEventOnParent);

      expect(eventSpy.callCount).toEqual(4);
    });

    it('calls handler on a component instance', () => {
      fixture('<div class="body-events-context"></div>');

      const eventSpy = sinon.spy();

      let component;

      application.component('.body-events-context', {
        init() {
          component = this;
        },

        'click, custom-event on body': eventSpy,
      }).vitalize();

      const node = document.querySelector('.body-events-context');

      expect(eventSpy.callCount).toEqual(0);
      expect(component).toBeTruthy();

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).calledOn(component)).toBe(true);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).calledOn(component)).toBe(true);
    });

    it('passes an event to a handler', () => {
      fixture('<div class="body-events-event"></div>');

      const eventSpy = sinon.spy();

      application.component('.body-events-event', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      const node = document.querySelector('.body-events-event');

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).args[0] instanceof Event).toBe(true);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).args[0] instanceof Event).toBe(true);
    });
  });
});
