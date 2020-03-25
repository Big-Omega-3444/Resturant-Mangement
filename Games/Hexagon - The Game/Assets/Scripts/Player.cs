using System.Collections;
using System.Collections.Generic;
using UnityEngine.EventSystems;
using UnityEngine;
using TMPro;

public class Player : MonoBehaviour
{
    public Scoreboard scoreboard;
    public leaderboardController lc;
    public MenuController mc;
    public GameObject leaderUI;
    public GameObject inputUI;

    private float mouseX = 0f;
    public float moveSpeed = 10f;

    // Start is called before the first frame update
    void Update()
    {
        mouseX = Input.GetAxisRaw("Mouse X");
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        transform.RotateAround(Vector3.zero, Vector3.forward, mouseX * Time.fixedDeltaTime * -moveSpeed);
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        Time.timeScale = 0f; // pause the game
        if (lc.DidIPlace(scoreboard.score))
        {
            inputUI.gameObject.SetActive(true);
            inputUI.transform.GetComponentInChildren<TMP_InputField>().OnPointerClick(new PointerEventData(EventSystem.current));
        }
        else
            mc.ToggleScoreboard();
    }

    public void SubmitScore()
    {
        lc.AddHighScoreEntry(scoreboard.score, inputUI.GetComponentInChildren<TMP_InputField>().text);
        mc.ToggleScoreboard();
        inputUI.gameObject.SetActive(false);
    }
}
