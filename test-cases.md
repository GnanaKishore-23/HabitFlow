# Test Cases — HabitFlow

Run each case in a modern browser and fill in the actual result/status after execution.

| Test ID | Requirement | Scenario | Input / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC01 | FR01 | Add valid habit | Name: Read 20 minutes | Habit appears in list | To be recorded | Not run |
| TC02 | FR01 | Empty name | Submit blank name | Validation prevents save | To be recorded | Not run |
| TC03 | FR01 | Duplicate name | Add same name twice | Duplicate warning appears | To be recorded | Not run |
| TC04 | FR02 | Mark complete | Click check button | Habit is marked complete and stats update | To be recorded | Not run |
| TC05 | FR02 | Mark incomplete | Click completed habit again | Completion is removed | To be recorded | Not run |
| TC06 | FR03 | Edit habit | Change name/category/time | Updated values appear | To be recorded | Not run |
| TC07 | FR04 | Delete habit | Click Delete and confirm | Habit is removed | To be recorded | Not run |
| TC08 | FR05 | Filter habits | Select To do / Completed | Only matching habits appear | To be recorded | Not run |
| TC09 | FR06 | Persistence | Refresh the page | Saved habits remain | To be recorded | Not run |
| TC10 | NFR01 | Responsive UI | Resize browser to mobile width | Content adapts to narrow screen | To be recorded | Not run |
| TC11 | NFR02 | Long habit name | Enter 60 characters | Text remains usable and layout does not overflow | To be recorded | Not run |
| TC12 | NFR03 | HTML-like input | Enter `<script>alert(1)</script>` as name | Text is displayed as text, not executed | To be recorded | Not run |

**Important:** Do not mark tests as passed until you execute them and observe the result.
