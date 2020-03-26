using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuController : MonoBehaviour
{
    private Canvas canvas;
    bool paused = false;
    bool touchControls = false;
    public Transform LeaderUI;
    public Joystick joystick;
    

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
        if (Input.touches.Length > 0 && !touchControls)
        {
            touchControls = true;
            Cursor.lockState = CursorLockMode.Confined;
        }

        if (SceneManager.GetActiveScene().buildIndex == 1)
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
        if(!touchControls)
        {
            Cursor.visible = true;
            Cursor.lockState = CursorLockMode.None;
        }
    }
    private void Resume()
    {
        Time.timeScale = 1f;
        if(!touchControls)
        {
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }
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

        if(SceneManager.GetActiveScene().buildIndex == 1)
            joystick.gameObject.SetActive(!joystick.gameObject.activeSelf);
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
