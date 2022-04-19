import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {GfxInterpreter} from "../../src/core/GfxInterpreter";
import {AppController} from "../../src/core/AppController";
import {ObjectType} from "../../src/geometry/GrObject";


describe('Marking Objects as guide', () => {

    it('Works', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            CIRCLECR Circle2,$styles.default,(445.79, 368.74),294.60
            RECTTL Rectangle3,$styles.default,(845.48, 413.15),214.89,134.66
            LINEPP Line1,$styles.default,Circle2@right,Rectangle3@left        
        `;

        await controller.setCode(code);

        controller.handleObjectSelection(state.objects.find(o => o.uniqueName === "Circle2"));
        await controller.makeSelectedObjectsGuides();

        expect(state.objects.find(o => o.uniqueName === "Circle2").isGuide).to.be.true;

        // Trigger a redraw
        await controller.addStatement("LINEPP Line2,$styles.default,Circle2@top,Rectangle3@left")

        //After redraw it's still a guide
        expect(state.objects.find(o => o.uniqueName === "Circle2").isGuide).to.be.true;

        // Marking again will remove the guide state
        controller.deselectAllObjects();
        controller.handleObjectSelection(state.objects.find(o => o.uniqueName === "Circle2"));
        await controller.makeSelectedObjectsGuides();
        expect(state.objects.find(o => o.uniqueName === "Circle2").isGuide).to.be.false;
    });

    it("will not make a list of guides created in a loop", async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            DO 4
            RECTTL Rectangle,$styles.default,(845.48, 413.15),214.89,134.66
            ENDDO        
        `;

        await controller.setCode(code);

        expect(state.objects.find(o => o.uniqueName === "Rectangle").type).to.be.equal(ObjectType.List);

        controller.deselectAllObjects();
        controller.handleObjectSelection(state.objects.find(o => o.uniqueName === "Rectangle"));
        await controller.makeSelectedObjectsGuides();

        expect(state.objects.find(o => o.uniqueName === "Rectangle").type).to.be.equal(ObjectType.Rectangle);

        // Remove Guide state
        controller.deselectAllObjects();
        controller.handleObjectSelection(state.objects.find(o => o.uniqueName === "Rectangle"));
        await controller.makeSelectedObjectsGuides();

        expect(state.objects.find(o => o.uniqueName === "Rectangle").type).to.be.equal(ObjectType.List);
    });

    it("deleting an object and creating one with the same name will not make the new one a guid if the old one was", async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            CIRCLECR Circle2,$styles.default,(445.79, 368.74),294.60
            RECTTL Rectangle1,$styles.default,(845.48, 413.15),214.89,134.66                    
        `;

        await controller.setCode(code);

        controller.handleObjectSelection(state.objects.find(o => o.uniqueName === "Circle2"));
        await controller.makeSelectedObjectsGuides();

        expect(state.objects.find(o => o.uniqueName === "Circle2").isGuide).to.be.true;

        controller.deselectAllObjects();
        controller.handleObjectSelection(state.objects.find(o => o.uniqueName === "Circle2"));
        await controller.deleteSelectedObjects();
        expect(state.objects.filter(o => o.type !== ObjectType.Canvas).length).to.equal(1);

        await controller.addStatement("CIRCLECR Circle2,$styles.default,(445.79, 368.74),294.60")
        expect(state.objects.filter(o => o.type !== ObjectType.Canvas).length).to.equal(2);
        expect(state.objects.filter(o => o.isGuide).length).to.equal(0);
    });

    it("reset will not make an object of the same name a guide again", async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            CIRCLECR Circle2,$styles.default,(445.79, 368.74),294.60
            RECTTL Rectangle1,$styles.default,(845.48, 413.15),214.89,134.66
            LINEPP Line1,$styles.default,Circle2@right,Rectangle1@left        
        `;

        await controller.setCode(code);

        controller.handleObjectSelection(state.objects.find(o => o.uniqueName === "Circle2"));
        await controller.makeSelectedObjectsGuides();

        expect(state.objects.find(o => o.uniqueName === "Circle2").isGuide).to.be.true;

        controller.resetAll();

        expect(state.objects.filter(o => o.type !== ObjectType.Canvas).length).to.equal(0);

        await controller.setCode(code);
        expect(state.objects.filter(o => o.type !== ObjectType.Canvas).length).to.equal(3);
        expect(state.objects.filter(o => o.isGuide).length).to.equal(0);
    });
});
