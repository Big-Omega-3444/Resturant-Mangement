using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuController : MonoBehaviour
{
    private Canvas canvas;
    public bool paused = false;

    public Transform LeaderUI;

    private void Start()
    {
        if (SceneManager.GetActiveScene().buildIndex == 1)
        {
            paused = false;
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
            canvas = GetComponent<Canvas>();
            canvas.enabled = false;
        }
        else
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
    }

    private void Update()
    {

        if(SceneManager.GetActiveScene().buildIndex == 1)
        {
            if (Input.GetButtonDown("Cancel") && !LeaderUI.gameObject.activeSelf)
            {
                paused = !paused;

                if (!paused)
                {
                    canvas.enabled = false;
                    Resume();
                }


                if (paused)
                {
                    canvas.enabled = true;
                    Pause();
                }
            }
        }
    }

    private void Pause()
    {
        Time.timeScale = 0f;
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
    }
    private void Resume()
    {
        Time.timeScale = 1f;
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }

    public void PlayGame()
    {
        Resume();
        SceneManager.LoadScene(1);
    }

    public void ReturntoMain()
    {
        Resume();
        SceneManager.LoadScene(0);
    }

    public void ToggleScoreboard()
    {
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
        LeaderUI.gameObject.SetActive(!LeaderUI.gameObject.activeSelf);
    }

    public void ClearScoreboard()
    {
        PlayerPrefs.DeleteKey("LeaderboardTable");
        ToggleScoreboard();
    }

    public void ExitGame()
    {
        PlayerPrefs.DeleteAll();
        Application.Quit();
    }
}
