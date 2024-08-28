/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2017
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/

package com.ericsson.oss.testware.usat.page.object
import com.ericsson.oss.testware.usat.page.fragment.ExecutionLog
import com.ericsson.oss.testware.usat.page.fragment.BreadCrumbs
import org.jboss.arquillian.graphene.page.Location
import org.openqa.selenium.support.FindBy

@Location("/#sap-execution-log")
class ExecutionLogPage implements PageObject {

    @FindBy(css = ".eaContainer-applicationHolder")
    ExecutionLog executionLog

    @FindBy(css = ".ebBreadcrumbs-link")
    BreadCrumbs breadCrumbs

    @Override
    void waitForLoad() {
        executionLog.waitForLoad()
    }

    String clickBreadcrumbDropDown() {
        return breadCrumbs.clickBreadcrumbDropDown()
    }
    String clickBreadcrumbDropDownItem() {
        return breadCrumbs.clickDecisionRulesDropDownItem()
    }

    boolean isLegalNoticeDisplayed() {
        return executionLog.legalNoticeBoxDisplayed()
    }

    boolean isLegalNoticeHeaderDisplayed() {
        pause()
        return executionLog.legalNoticeHeaderDisplayed()
    }

    boolean isExecutionLogHeaderDisplayed() {
        pause()
        return executionLog.executionLogHeaderDisplayed()
    }

    boolean isCreationDateDisplayed() {
        pause()
        return executionLog.creationDateDisplayed()
    }

    String clickLegalNoticeOKButton() {
        pause()
        return executionLog.clickOKButton()
    }

    synchronized void pause() {
        wait(2000)
    }
}
