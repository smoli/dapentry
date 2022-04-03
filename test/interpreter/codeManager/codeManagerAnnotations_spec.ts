import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../../src/runtime/CodeManager";


describe('Code Manager - Annotations', () => {

    it("unannotated lines stay untouched", () => {
        const m = new CodeManager();

        const code = `
                LOAD r1, 20
                LOAD r2, r1
                LOAD lkjh, (r1, 10)
                LOAD TESTtestTEST, [r1, lkjh, 10, 10, 20, r1, 220, r2]
                ADD r2, r2, r1
                ITER iter, TESTtestTEST
            `;

        m.addCodeString(code);

        expect(m.annotatedCode).to.deep.equal([
            { originalLine: 0, code: "LOAD r1, 20", level: 0 },
            { originalLine: 1, code: "LOAD r2, r1", level: 0 },
            { originalLine: 2, code: "LOAD lkjh, (r1, 10)", level: 0 },
            { originalLine: 3, code: "LOAD TESTtestTEST, [r1, lkjh, 10, 10, 20, r1, 220, r2]", level: 0 },
            { originalLine: 4, code: "ADD r2, r2, r1", level: 0 },
            { originalLine: 5, code: "ITER iter, TESTtestTEST", level: 0 }
        ]);
    });

    it("can hide statements", () => {

        const code = `
                RECT Rectangle1-Prev, $styles.default, ( 360, 500 ), 218, f1iter.value
                APP Rectangle1.objects, Rectangle1-Prev                              @HIDE
                LOAD r1, 200
            `;

        const m = new CodeManager();
        m.addCodeString(code);

        const annotated = m.annotatedCode;

        expect(annotated).to.deep.equal([
            { originalLine: 0, code: "RECT Rectangle1-Prev, $styles.default, (360, 500), 218, f1iter.value", level: 0 },
            { originalLine: 2, code: "LOAD r1, 200", level: 0 }
        ]);

    });
    +
        it("is not confused by at-access", () => {
            const code = `CIRCLE Circle1, $styles.default, (224, 269), 74.43117626371358
                        CIRCLE Circle2, $styles.default, (319, 493), 94.64142856064674
                        MOVE Circle2@bottom, Circle1@top
            `;
            const m = new CodeManager();
            m.addCodeString(code);
            const annotated = m.annotatedCode;

            expect(annotated).to.deep.equal([
                { originalLine: 0, code: "CIRCLE Circle1, $styles.default, (224, 269), 74.43117626371358", level: 0 },
                { originalLine: 1, code: "CIRCLE Circle2, $styles.default, (319, 493), 94.64142856064674", level: 0 },
                { originalLine: 2, code: "MOVE Circle2@bottom, Circle1@top", level: 0 }
            ])


        })

    it("can create blocks", () => {
        const code = `
                @EACH f1 @REPLACE Rectangle1-Tmp Rectangle1 @REPLACE f1iter.value f1
                    ITER f1iter, f1
                    OBLIST Rectangle1
                    RECT Rectangle1-Tmp, $styles.default, ( 408.5, 395.5 ), 219, f1iter.value            
                    APP Rectangle1.objects, Rectangle1-Tmp
                    LOAD Rectangle1-Prev, Rectangle1-Tmp
                    NEXT f1iter
                LOOPF1:
                @BODY    @REPLACE Rectangle1-Tmp Box1
                    RECT Rectangle1-Tmp, $styles.default, ( 408.5, 395.5 ), 219, f1iter.value
                    MOVE Rectangle1-Tmp, "bottom", Rectangle1-Prev, "top"                          @REPLACE Rectangle1-Prev Previous
                    LOAD r1, r2                                                                  @REPLACE r2 renault
                @ENDBODY
                    LOAD Rectangle1-Prev, Rectangle1-Tmp
                    APP Rectangle1.objects, Rectangle1-Tmp
                    NEXT f1iter
                    JINE f1iter, LOOPF1
                @ENDEACH
                    APP $drawing, Rectangle1                @HIDE
           `;

        const m = new CodeManager();
        m.addCodeString(code);

        const annotated = m.annotatedCode;

        expect(annotated).to.deep.equal([
            { originalLine: 0, code: "@EACH f1", level: 0 },
            { originalLine: 9, code: "RECT Box1, $styles.default, (408.5, 395.5), 219, f1", level: 1 },
            { originalLine: 10, code: 'MOVE Box1, "bottom", Previous, "top"', level: 1 },
            { originalLine: 11, code: "LOAD r1, renault", level: 1 }
        ])

    });


    it("can tell for each statement how deeply nested it is in loops", () => {

        const code = `
                    LOAD r1, 10
                    LOAD r2, [1, 2, 3, 4]
                    FOREACH r2
                        ADD r1, 1
                        DO 5
                            ADD r1, 2
                        ENDDO
                        ADD r1, 3
                    ENDEACH
                    ADD r1, 4
                `;

        const m = new CodeManager();
        m.addCodeString(code);

        expect(m.annotatedCode.map(c => c.level)).to.deep.equal([
            0, 0, 0, 1, 1, 2, 1, 1, 0, 0
        ]);
    });

    it("can create blocks from DO/ENDDO", () => {

        const code = `
                    LOAD r0, 0
                    DO 23
                    ADD r0, 1
                    MUL r0, 2
                    ENDDO
                    ADD r0, 12
            `;
        const m = new CodeManager();
        m.addCodeString(code);

        const annotated = m.annotatedCode;

        expect(annotated).to.deep.equal([
            { originalLine: 0, code: "LOAD r0, 0", level: 0 },
            { originalLine: 1, code: "DO 23", level: 0 },
            { originalLine: 2, code: "ADD r0, 1", level: 1 },
            { originalLine: 3, code: "MUL r0, 2", level: 1 },
            { originalLine: 4, code: "ENDDO", level: 0 },
            { originalLine: 5, code: "ADD r0, 12", level: 0 }
        ])
    });
});