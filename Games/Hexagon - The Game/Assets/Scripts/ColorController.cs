using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ColorController : MonoBehaviour
{
    public Material worldColor;
    public Material hexColor;
    public SpriteRenderer BG;
    public Scoreboard score;
    int lastScoreChange = 0;
    public int changeEvery = 10;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(score.score % changeEvery == 0 && lastScoreChange != score.score)
        {
            Color newCol = Random.ColorHSV();

            float h,s,v;
            Color.RGBToHSV(newCol, out h, out s, out v);
            if (v < .8f)
            {
                v = 0.8f;
                newCol = Color.HSVToRGB(h, s, v);
            }
            if (s < .8f)
            {
                s = 0.8f;
                newCol = Color.HSVToRGB(h,s,v);
            }

            switch(Random.Range(1,2))
            {
                case 1: h += .3f; break;
                case 2: h += .6f; break;
            }

            if (h > 1.0f)
                h -= 1.0f;

            Color compCol = Color.HSVToRGB(h, s, v);

            worldColor.color = newCol;
            hexColor.color = compCol;
            BG.material = worldColor;
            lastScoreChange = score.score;
        }
    }
}
